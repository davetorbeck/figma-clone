# Persistence Strategy

## Overview

Two-layer persistence with Zustand persist for localStorage, Convex for server sync.

- **Zustand persist**: Instant startup from localStorage
- **Convex**: Multi-device sync, server persistence

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    App Start                         │
├─────────────────────────────────────────────────────┤
│  1. Zustand persist loads from localStorage (sync)  │
│  2. useConvexSync queries Convex (async)            │
│  3. Convex data replaces local state (if exists)    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  State Change                        │
├─────────────────────────────────────────────────────┤
│  1. User modifies state                              │
│  2. Zustand persist saves to localStorage (auto)    │
│  3. useConvexSync debounces 500ms                   │
│  4. Save to Convex (async)                          │
└─────────────────────────────────────────────────────┘
```

## Implementation

### Store (src/store.ts)

```ts
export const useCanvasStore = create<CanvasState>()(
  persist(
    temporal(
      (set, get) => ({ /* state and actions */ }),
      { partialize: (state) => ({ shapes: state.shapes }), limit: 50 }
    ),
    {
      name: "figma-clone:canvas",
      partialize: (state) => ({
        shapes: state.shapes,
        zoom: state.zoom,
        offset: state.offset,
      }),
    }
  )
);
```

### Convex Sync Hook (src/hooks/use-convex-sync.ts)

```ts
export function useConvexSync() {
  const [isReady, setIsReady] = useState(false);
  const savedState = useQuery(api.canvas.get);
  const save = useMutation(api.canvas.save);

  // Load from Convex (overwrites localStorage)
  useEffect(() => {
    if (savedState === undefined) return;
    if (savedState) {
      setShapes(savedState.shapes);
      setZoom(savedState.zoom);
      setOffset({ x: savedState.offsetX, y: savedState.offsetY });
    }
    setIsReady(true);
  }, [savedState]);

  // Save to Convex (debounced)
  useEffect(() => {
    if (!isReady) return;
    save({ shapes, zoom, offsetX, offsetY, updatedAt: Date.now() });
  }, [debouncedShapes, debouncedZoom, debouncedOffset]);
}
```

## Conflict Resolution

**Convex always wins.** On load:
- Convex data replaces local state
- localStorage is a cache for fast startup only

## Offline Behavior

- localStorage saves always work (Zustand persist)
- Convex saves fail silently when offline
- On reconnect, Convex query returns server state
- Server state wins (may lose offline edits)

## Data Schema

### Convex (convex/schema.ts)

```ts
canvasState: defineTable({
  shapes: v.array(shapeValidator),
  zoom: v.number(),
  offsetX: v.number(),
  offsetY: v.number(),
  updatedAt: v.number(),
})
```

### localStorage

Key: `figma-clone:canvas`

```json
{
  "state": {
    "shapes": [...],
    "zoom": 1,
    "offset": { "x": 0, "y": 0 }
  },
  "version": 0
}
```
