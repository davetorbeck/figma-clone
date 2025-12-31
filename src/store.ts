import { create } from "zustand";
import { temporal } from "zundo";
import type { Shape, Tool, Point } from "./types";

interface CanvasState {
  shapes: Shape[];
  selectedId: string | null;
  tool: Tool;
  zoom: number;
  offset: Point;

  addShape: (shape: Shape) => void;
  updateShape: (shape: Shape) => void;
  deleteShape: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setOffset: (offset: Point) => void;
  duplicateSelected: () => void;
  setColor: (color: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
  temporal(
    (set, get) => ({
      shapes: [],
      selectedId: null,
      tool: "select",
      zoom: 1,
      offset: { x: 0, y: 0 },

      addShape: (shape) =>
        set((state) => ({
          shapes: [...state.shapes, shape],
          selectedId: shape.id,
          tool: "select",
        })),

      updateShape: (shape) =>
        set((state) => ({
          shapes: state.shapes.map((s) => (s.id === shape.id ? shape : s)),
        })),

      deleteShape: (id) =>
        set((state) => ({
          shapes: state.shapes.filter((s) => s.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        })),

      setSelectedId: (id) => set({ selectedId: id }),

      setTool: (tool) =>
        set({
          tool,
          selectedId: tool !== "select" ? null : get().selectedId,
        }),

      setZoom: (zoom) => set({ zoom }),

      setOffset: (offset) => set({ offset }),

      duplicateSelected: () => {
        const { selectedId, shapes } = get();
        if (!selectedId) return;
        const shape = shapes.find((s) => s.id === selectedId);
        if (!shape) return;
        const duplicate: Shape = {
          ...shape,
          id: crypto.randomUUID(),
          x: shape.x + 20,
          y: shape.y + 20,
        };
        set((state) => ({
          shapes: [...state.shapes, duplicate],
          selectedId: duplicate.id,
        }));
      },

      setColor: (color) =>
        set((state) => {
          if (!state.selectedId) return state;
          return {
            shapes: state.shapes.map((s) =>
              s.id === state.selectedId ? { ...s, fill: color } : s,
            ),
          };
        }),
    }),
    {
      partialize: (state) => ({ shapes: state.shapes }),
      limit: 50,
    },
  ),
);
