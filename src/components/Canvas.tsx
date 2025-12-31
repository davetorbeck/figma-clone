import { useRef, useEffect, useCallback, useState } from "react";
import { useCanvasStore } from "@/store";
import type { Shape, Point } from "@/types";

type DragMode = "none" | "create" | "move" | "resize" | "pan";
type ResizeHandle = "nw" | "ne" | "sw" | "se" | null;

const CURSOR = {
  default: "cursor-default",
  crosshair: "cursor-crosshair",
  grab: "cursor-grab",
  grabbing: "cursor-grabbing",
  nwseResize: "cursor-nwse-resize",
  neswResize: "cursor-nesw-resize",
} as const;

export function Canvas() {
  const {
    shapes,
    selectedId,
    tool,
    zoom,
    offset,
    addShape,
    updateShape,
    setSelectedId,
    setZoom,
    setOffset,
  } = useCanvasStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [panStart, setPanStart] = useState<Point | null>(null);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [hoveredHandle, setHoveredHandle] = useState<ResizeHandle>(null);
  const [tempShape, setTempShape] = useState<Shape | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Point => ({
      x: (screenX - offset.x) / zoom,
      y: (screenY - offset.y) / zoom,
    }),
    [zoom, offset],
  );

  const getMousePos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
    },
    [screenToCanvas],
  );

  const getShapeAtPoint = useCallback(
    (point: Point): Shape | null => {
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
    },
    [shapes],
  );

  const getResizeHandle = useCallback(
    (point: Point, shape: Shape): ResizeHandle => {
      const handleSize = 8 / zoom;
      const handles: { handle: ResizeHandle; x: number; y: number }[] = [
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
    },
    [zoom],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isSpacePressed) {
        setDragMode("pan");
        setPanStart({ x: e.clientX, y: e.clientY });
        return;
      }

      const pos = getMousePos(e);
      const selectedShape = shapes.find((s) => s.id === selectedId);

      if (tool === "select") {
        if (selectedShape) {
          const handle = getResizeHandle(pos, selectedShape);
          if (handle) {
            setDragMode("resize");
            setResizeHandle(handle);
            setDragStart(pos);
            return;
          }
        }

        const clickedShape = getShapeAtPoint(pos);
        if (clickedShape) {
          setSelectedId(clickedShape.id);
          setDragMode("move");
          setDragStart(pos);
        } else {
          setSelectedId(null);
        }
      } else {
        setDragMode("create");
        setDragStart(pos);
        setTempShape({
          id: crypto.randomUUID(),
          type: tool,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fill: tool === "rectangle" ? "#3b82f6" : "#8b5cf6",
        });
      }
    },
    [
      tool,
      shapes,
      selectedId,
      isSpacePressed,
      getMousePos,
      getShapeAtPoint,
      getResizeHandle,
      setSelectedId,
    ],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (dragMode === "pan" && panStart) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setOffset({ x: offset.x + dx, y: offset.y + dy });
        setPanStart({ x: e.clientX, y: e.clientY });
        return;
      }

      const pos = getMousePos(e);

      if (dragMode === "none") {
        const selectedShape = shapes.find((s) => s.id === selectedId);
        if (selectedShape) {
          setHoveredHandle(getResizeHandle(pos, selectedShape));
        } else {
          setHoveredHandle(null);
        }
      }

      if (dragMode === "none" || !dragStart) return;
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;

      if (dragMode === "create" && tempShape) {
        setTempShape({ ...tempShape, width: dx, height: dy });
      } else if (dragMode === "move" && selectedId) {
        const shape = shapes.find((s) => s.id === selectedId);
        if (shape) {
          updateShape({ ...shape, x: shape.x + dx, y: shape.y + dy });
          setDragStart(pos);
        }
      } else if (dragMode === "resize" && selectedId && resizeHandle) {
        const shape = shapes.find((s) => s.id === selectedId);
        if (shape) {
          const newShape = { ...shape };
          switch (resizeHandle) {
            case "se":
              newShape.width = shape.width + dx;
              newShape.height = shape.height + dy;
              break;
            case "sw":
              newShape.x = shape.x + dx;
              newShape.width = shape.width - dx;
              newShape.height = shape.height + dy;
              break;
            case "ne":
              newShape.y = shape.y + dy;
              newShape.width = shape.width + dx;
              newShape.height = shape.height - dy;
              break;
            case "nw":
              newShape.x = shape.x + dx;
              newShape.y = shape.y + dy;
              newShape.width = shape.width - dx;
              newShape.height = shape.height - dy;
              break;
          }
          updateShape(newShape);
          setDragStart(pos);
        }
      }
    },
    [
      dragMode,
      dragStart,
      panStart,
      tempShape,
      selectedId,
      shapes,
      resizeHandle,
      offset,
      getMousePos,
      getResizeHandle,
      updateShape,
      setOffset,
    ],
  );

  const handleMouseUp = useCallback(() => {
    if (dragMode === "pan") {
      setDragMode("none");
      setPanStart(null);
      return;
    }

    if (dragMode === "create" && tempShape) {
      const normalized: Shape = {
        ...tempShape,
        x: tempShape.width < 0 ? tempShape.x + tempShape.width : tempShape.x,
        y: tempShape.height < 0 ? tempShape.y + tempShape.height : tempShape.y,
        width: Math.abs(tempShape.width),
        height: Math.abs(tempShape.height),
      };

      if (normalized.width > 5 && normalized.height > 5) {
        addShape(normalized);
      }
    }

    setDragMode("none");
    setDragStart(null);
    setTempShape(null);
    setResizeHandle(null);
  }, [dragMode, tempShape, addShape]);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.95 : 1.05;
        const newZoom = Math.min(Math.max(zoom * delta, 0.1), 5);

        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          setOffset({
            x: mouseX - (mouseX - offset.x) * (newZoom / zoom),
            y: mouseY - (mouseY - offset.y) * (newZoom / zoom),
          });
        }

        setZoom(newZoom);
      }
    },
    [zoom, offset, setZoom, setOffset],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1 / zoom;
    const gridSize = 20;
    const startX = Math.floor(-offset.x / zoom / gridSize) * gridSize;
    const startY = Math.floor(-offset.y / zoom / gridSize) * gridSize;
    const endX = startX + canvas.width / zoom + gridSize * 2;
    const endY = startY + canvas.height / zoom + gridSize * 2;

    for (let x = startX; x < endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    for (let y = startY; y < endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }

    const allShapes = tempShape ? [...shapes, tempShape] : shapes;
    for (const shape of allShapes) {
      ctx.fillStyle = shape.fill;
      ctx.strokeStyle = shape.id === selectedId ? "#fff" : "transparent";
      ctx.lineWidth = 2 / zoom;

      if (shape.type === "rectangle") {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "ellipse") {
        ctx.beginPath();
        ctx.ellipse(
          shape.x + shape.width / 2,
          shape.y + shape.height / 2,
          Math.abs(shape.width / 2),
          Math.abs(shape.height / 2),
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.stroke();
      }

      if (shape.id === selectedId) {
        const handleSize = 8 / zoom;
        ctx.fillStyle = "#fff";
        const handles = [
          { x: shape.x, y: shape.y },
          { x: shape.x + shape.width, y: shape.y },
          { x: shape.x, y: shape.y + shape.height },
          { x: shape.x + shape.width, y: shape.y + shape.height },
        ];
        for (const { x, y } of handles) {
          ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
        }
      }
    }

    ctx.restore();
  }, [shapes, selectedId, tempShape, zoom, offset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventDefaultWheel = (e: WheelEvent) => {
      if (e.metaKey || e.ctrlKey) e.preventDefault();
    };

    canvas.addEventListener("wheel", preventDefaultWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", preventDefaultWheel);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        if (dragMode === "pan") {
          setDragMode("none");
          setPanStart(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dragMode]);

  const getCursor = () => {
    if (isSpacePressed) {
      return dragMode === "pan" ? CURSOR.grabbing : CURSOR.grab;
    }
    if (hoveredHandle === "nw" || hoveredHandle === "se") {
      return CURSOR.nwseResize;
    }
    if (hoveredHandle === "ne" || hoveredHandle === "sw") {
      return CURSOR.neswResize;
    }
    if (tool !== "select") {
      return CURSOR.crosshair;
    }
    return CURSOR.default;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`size-full ${getCursor()}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}
