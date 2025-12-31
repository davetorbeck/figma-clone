import { describe, test, expect } from "bun:test";
import {
  screenToCanvas,
  getShapeAtPoint,
  getResizeHandle,
  normalizeShape,
} from "../src/lib/canvas-utils";
import type { Shape } from "../src/types";

const createShape = (overrides: Partial<Shape> = {}): Shape => ({
  id: "1",
  type: "rectangle",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  fill: "#f00",
  ...overrides,
});

describe("screenToCanvas", () => {
  test("converts with zoom and offset", () => {
    expect(screenToCanvas(200, 150, { x: 100, y: 50 }, 2)).toEqual({ x: 50, y: 50 });
  });

  test("handles zoom out", () => {
    expect(screenToCanvas(100, 100, { x: 0, y: 0 }, 0.5)).toEqual({ x: 200, y: 200 });
  });

  test("handles negative offset (panned left/up)", () => {
    expect(screenToCanvas(50, 50, { x: -100, y: -100 }, 1)).toEqual({ x: 150, y: 150 });
  });
});

describe("getShapeAtPoint", () => {
  const shapes: Shape[] = [
    createShape({ id: "1", x: 0, y: 0 }),
    createShape({ id: "2", x: 50, y: 50 }),
  ];

  test("returns topmost shape when overlapping", () => {
    expect(getShapeAtPoint({ x: 75, y: 75 }, shapes)?.id).toBe("2");
  });

  test("returns null when clicking empty area", () => {
    expect(getShapeAtPoint({ x: 200, y: 200 }, shapes)).toBeNull();
  });

  test("returns first shape in non-overlapping area", () => {
    expect(getShapeAtPoint({ x: 25, y: 25 }, shapes)?.id).toBe("1");
  });

  test("detects shape at boundary", () => {
    expect(getShapeAtPoint({ x: 0, y: 0 }, shapes)?.id).toBe("1");
    expect(getShapeAtPoint({ x: 100, y: 100 }, shapes)?.id).toBe("2");
  });
});

describe("getResizeHandle", () => {
  const shape = createShape({ x: 100, y: 100, width: 200, height: 150 });

  test("detects corner handles at zoom 1", () => {
    expect(getResizeHandle({ x: 100, y: 100 }, shape, 1)).toBe("nw");
    expect(getResizeHandle({ x: 300, y: 100 }, shape, 1)).toBe("ne");
    expect(getResizeHandle({ x: 100, y: 250 }, shape, 1)).toBe("sw");
    expect(getResizeHandle({ x: 300, y: 250 }, shape, 1)).toBe("se");
  });

  test("returns null when not near a handle", () => {
    expect(getResizeHandle({ x: 200, y: 175 }, shape, 1)).toBeNull();
  });

  test("handle hitbox scales with zoom", () => {
    // At zoom 2, handle size is 4px (8/2), so must be within 4px
    expect(getResizeHandle({ x: 103, y: 103 }, shape, 2)).toBe("nw");
    expect(getResizeHandle({ x: 106, y: 106 }, shape, 2)).toBeNull();
  });
});

describe("normalizeShape", () => {
  test("flips negative width", () => {
    const shape = createShape({ x: 100, y: 50, width: -50, height: 30 });
    const result = normalizeShape(shape);
    expect(result).toMatchObject({ x: 50, y: 50, width: 50, height: 30 });
  });

  test("flips negative height", () => {
    const shape = createShape({ x: 100, y: 100, width: 50, height: -60 });
    const result = normalizeShape(shape);
    expect(result).toMatchObject({ x: 100, y: 40, width: 50, height: 60 });
  });

  test("flips both negative dimensions", () => {
    const shape = createShape({ x: 100, y: 100, width: -50, height: -60 });
    const result = normalizeShape(shape);
    expect(result).toMatchObject({ x: 50, y: 40, width: 50, height: 60 });
  });

  test("leaves positive dimensions unchanged", () => {
    const shape = createShape({ x: 10, y: 20, width: 30, height: 40 });
    const result = normalizeShape(shape);
    expect(result).toMatchObject({ x: 10, y: 20, width: 30, height: 40 });
  });
});
