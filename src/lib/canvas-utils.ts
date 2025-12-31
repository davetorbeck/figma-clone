import type { Shape, Point } from "@/types";

export function screenToCanvas(
  screenX: number,
  screenY: number,
  offset: Point,
  zoom: number,
): Point {
  return {
    x: (screenX - offset.x) / zoom,
    y: (screenY - offset.y) / zoom,
  };
}

export function getShapeAtPoint(point: Point, shapes: Shape[]): Shape | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (
      point.x >= shape.x &&
      point.x <= shape.x + shape.width &&
      point.y >= shape.y &&
      point.y <= shape.y + shape.height
    ) {
      return shape;
    }
  }
  return null;
}

export function getResizeHandle(
  point: Point,
  shape: Shape,
  zoom: number,
): "nw" | "ne" | "sw" | "se" | null {
  const handleSize = 8 / zoom;
  const handles: { handle: "nw" | "ne" | "sw" | "se"; x: number; y: number }[] = [
    { handle: "nw", x: shape.x, y: shape.y },
    { handle: "ne", x: shape.x + shape.width, y: shape.y },
    { handle: "sw", x: shape.x, y: shape.y + shape.height },
    { handle: "se", x: shape.x + shape.width, y: shape.y + shape.height },
  ];

  for (const { handle, x, y } of handles) {
    if (Math.abs(point.x - x) <= handleSize && Math.abs(point.y - y) <= handleSize) {
      return handle;
    }
  }
  return null;
}

export function normalizeShape(shape: Shape): Shape {
  return {
    ...shape,
    x: shape.width < 0 ? shape.x + shape.width : shape.x,
    y: shape.height < 0 ? shape.y + shape.height : shape.y,
    width: Math.abs(shape.width),
    height: Math.abs(shape.height),
  };
}
