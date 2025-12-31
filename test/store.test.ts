import { describe, test, expect, beforeEach } from "bun:test";
import { useCanvasStore } from "../src/store";

const createShape = (overrides = {}) => ({
  id: "1",
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

describe("setShapes", () => {
  beforeEach(resetStore);

  test("replaces all shapes", () => {
    const initial = [createShape({ id: "1" })];
    useCanvasStore.setState({ shapes: initial });

    const newShapes = [createShape({ id: "2" }), createShape({ id: "3" })];
    useCanvasStore.getState().setShapes(newShapes);

    expect(useCanvasStore.getState().shapes).toHaveLength(2);
    expect(useCanvasStore.getState().shapes[0].id).toBe("2");
    expect(useCanvasStore.getState().shapes[1].id).toBe("3");
  });

  test("clears shapes with empty array", () => {
    useCanvasStore.setState({ shapes: [createShape()] });

    useCanvasStore.getState().setShapes([]);

    expect(useCanvasStore.getState().shapes).toHaveLength(0);
  });
});

describe("duplicateSelected", () => {
  beforeEach(resetStore);

  test("creates copy offset by 20px and selects it", () => {
    const shape = createShape();
    useCanvasStore.setState({ shapes: [shape], selectedId: "1" });

    useCanvasStore.getState().duplicateSelected();

    const { shapes, selectedId } = useCanvasStore.getState();
    expect(shapes).toHaveLength(2);
    expect(shapes[1]).toMatchObject({ x: 120, y: 120, width: 50, height: 50, fill: "#f00" });
    expect(shapes[1].id).not.toBe("1");
    expect(selectedId).toBe(shapes[1].id);
  });

  test("does nothing when nothing selected", () => {
    useCanvasStore.getState().duplicateSelected();
    expect(useCanvasStore.getState().shapes).toHaveLength(0);
  });
});

describe("deleteShape", () => {
  beforeEach(resetStore);

  test("clears selectedId when deleting selected shape", () => {
    const shape = createShape();
    useCanvasStore.setState({ shapes: [shape], selectedId: "1" });

    useCanvasStore.getState().deleteShape("1");

    expect(useCanvasStore.getState().shapes).toHaveLength(0);
    expect(useCanvasStore.getState().selectedId).toBeNull();
  });

  test("preserves selectedId when deleting different shape", () => {
    const shapes = [createShape({ id: "1" }), createShape({ id: "2", x: 200 })];
    useCanvasStore.setState({ shapes, selectedId: "1" });

    useCanvasStore.getState().deleteShape("2");

    expect(useCanvasStore.getState().shapes).toHaveLength(1);
    expect(useCanvasStore.getState().selectedId).toBe("1");
  });
});

describe("setColor", () => {
  beforeEach(resetStore);

  test("updates fill of selected shape only", () => {
    const shapes = [createShape({ id: "1", fill: "#f00" }), createShape({ id: "2", fill: "#0f0" })];
    useCanvasStore.setState({ shapes, selectedId: "1" });

    useCanvasStore.getState().setColor("#00f");

    const updated = useCanvasStore.getState().shapes;
    expect(updated[0].fill).toBe("#00f");
    expect(updated[1].fill).toBe("#0f0");
  });

  test("does nothing when nothing selected", () => {
    const shapes = [createShape({ fill: "#f00" })];
    useCanvasStore.setState({ shapes, selectedId: null });

    useCanvasStore.getState().setColor("#00f");

    expect(useCanvasStore.getState().shapes[0].fill).toBe("#f00");
  });
});
