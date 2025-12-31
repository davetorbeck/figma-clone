# Figma Clone - Project Status

## Current Status

**Version:** 0.0.0 (MVP)  
**Last Updated:** December 2024

### Completed Features

#### Core Drawing
- Rectangle and ellipse shape creation via drag
- Shape selection with visual feedback (white border)
- Move shapes by dragging
- Resize shapes via corner handles (nw, ne, sw, se)
- Delete shapes (Delete/Backspace)
- Duplicate shapes (Cmd/Ctrl+D)

#### Viewport
- Zoom in/out (Cmd/Ctrl + scroll wheel)
- Pan canvas (Space + drag)
- Infinite canvas with grid background

#### State Management
- Zustand store with temporal middleware
- Undo/redo support (up to 50 history states)
- Persistent shape state

#### UI/UX
- Modern sidebar with tool selection
- Color picker for shape fill
- Keyboard shortcuts for all tools
- Montserrat typography

#### Testing
- Unit tests for store actions (Bun + happy-dom)
- Unit tests for canvas utility functions
- 20 passing tests

---

## Future Feature Ideas

### High Priority

#### Layers Panel
- Visual list of all shapes
- Drag to reorder z-index
- Toggle visibility per shape
- Lock/unlock shapes

#### Multi-Select
- Shift+click to add to selection
- Drag selection box
- Group actions (move, delete, duplicate)

#### More Shape Types
- Line/arrow tool
- Text tool with basic formatting
- Polygon/star shapes
- Freehand drawing (pen tool)

#### Stroke Properties
- Stroke color separate from fill
- Stroke width adjustment
- Stroke style (solid, dashed, dotted)

### Medium Priority

#### Export
- Export canvas as PNG
- Export as SVG
- Export selected shapes only

#### Alignment Tools
- Align left/center/right
- Align top/middle/bottom
- Distribute horizontally/vertically

#### Grid & Snapping
- Snap to grid
- Snap to other shapes
- Smart guides

#### Shape Operations
- Boolean operations (union, subtract, intersect)
- Flip horizontal/vertical
- Rotate shapes

### Low Priority / Nice to Have

#### Collaboration
- Real-time multi-user editing (WebSocket/WebRTC)
- Cursor presence
- Comments on shapes

#### Persistence
- Save/load projects (localStorage or backend)
- Auto-save
- Version history

#### Advanced Features
- Gradients (linear, radial)
- Shadows and effects
- Blend modes
- Constraints and auto-layout

#### Accessibility
- Keyboard navigation for all tools
- Screen reader support
- High contrast mode

---

## Technical Debt

- [ ] Extract more canvas rendering logic into testable functions
- [ ] Add integration tests for user interactions
- [ ] Consider switching to OffscreenCanvas for better performance
- [ ] Add error boundaries for React components
- [ ] Implement proper touch support for mobile devices

---

## Architecture Notes

### Current Stack
| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Framework | React 19 |
| State | Zustand + zundo |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix) |
| Build | Vite |
| Type Checking | tsgo |
| Linting | oxlint |
| Formatting | oxfmt |
| Testing | Bun test + happy-dom |

### File Structure
```
src/
  components/
    Canvas.tsx      # Main canvas component
    Toolbar.tsx     # Sidebar with tools
    ColorPicker.tsx # Color selection
    ui/             # shadcn components
  lib/
    canvas-utils.ts # Extracted pure functions
    utils.ts        # General utilities
  store.ts          # Zustand state
  types.ts          # TypeScript types
test/
  setup.ts          # happy-dom setup
  store.test.ts     # Store unit tests
  canvas-utils.test.ts # Utility tests
```
