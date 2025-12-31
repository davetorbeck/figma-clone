import { describe, test, expect, beforeEach, mock } from "bun:test";
import { useCanvasStore } from "../src/store";

const createShape = (overrides = {}) => ({
  id: crypto.randomUUID(),
  type: "rectangle" as const,
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  fill: "#f00",
  ...overrides,
});

const resetStore = () => {
  useCanvasStore.setState({
    shapes: [],
    selectedId: null,
    tool: "select",
    zoom: 1,
    offset: { x: 0, y: 0 },
  });
};

describe("Convex sync behavior", () => {
  beforeEach(resetStore);

  test("should only load from server once, not overwrite local changes", () => {
    const serverState = {
      shapes: [],
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    };

    let hasLoaded = false;

    const loadFromServer = () => {
      if (hasLoaded) return;
      hasLoaded = true;

      const { setShapes, setZoom, setOffset } = useCanvasStore.getState();
      setShapes(serverState.shapes);
      setZoom(serverState.zoom);
      setOffset({ x: serverState.offsetX, y: serverState.offsetY });
    };

    loadFromServer();
    expect(useCanvasStore.getState().shapes).toHaveLength(0);

    const newShape = createShape();
    useCanvasStore.getState().addShape(newShape);
    expect(useCanvasStore.getState().shapes).toHaveLength(1);

    loadFromServer();

    expect(useCanvasStore.getState().shapes).toHaveLength(1);
    expect(useCanvasStore.getState().shapes[0].id).toBe(newShape.id);
  });

  test("without guard, server response overwrites local changes", () => {
    const serverState = {
      shapes: [],
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    };

    const loadFromServerWithoutGuard = () => {
      const { setShapes, setZoom, setOffset } = useCanvasStore.getState();
      setShapes(serverState.shapes);
      setZoom(serverState.zoom);
      setOffset({ x: serverState.offsetX, y: serverState.offsetY });
    };

    loadFromServerWithoutGuard();
    expect(useCanvasStore.getState().shapes).toHaveLength(0);

    const newShape = createShape();
    useCanvasStore.getState().addShape(newShape);
    expect(useCanvasStore.getState().shapes).toHaveLength(1);

    loadFromServerWithoutGuard();

    expect(useCanvasStore.getState().shapes).toHaveLength(0);
  });
});
