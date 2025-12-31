import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCanvasStore } from "../store";
import { useDebounce } from "./use-debounce";

export function useConvexSync() {
  const shapes = useCanvasStore((s) => s.shapes);
  const zoom = useCanvasStore((s) => s.zoom);
  const offset = useCanvasStore((s) => s.offset);
  const setShapes = useCanvasStore((s) => s.setShapes);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const setOffset = useCanvasStore((s) => s.setOffset);

  const hasLoadedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const savedState = useQuery(api.canvas.get);
  const save = useMutation(api.canvas.save);

  const debouncedShapes = useDebounce(shapes, 500);
  const debouncedZoom = useDebounce(zoom, 500);
  const debouncedOffset = useDebounce(offset, 500);

  useEffect(() => {
    if (savedState === undefined || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    if (savedState) {
      setShapes(savedState.shapes);
      setZoom(savedState.zoom);
      setOffset({ x: savedState.offsetX, y: savedState.offsetY });
    }

    setIsReady(true);
  }, [savedState, setShapes, setZoom, setOffset]);

  useEffect(() => {
    if (!isReady) return;

    save({
      shapes: debouncedShapes,
      zoom: debouncedZoom,
      offsetX: debouncedOffset.x,
      offsetY: debouncedOffset.y,
      updatedAt: Date.now(),
    });
  }, [debouncedShapes, debouncedZoom, debouncedOffset, save, isReady]);
}
