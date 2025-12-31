import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { useCanvasStore } from "@/store";
import { useConvexSync } from "@/hooks/use-convex-sync";

function App() {
  const { selectedId, setTool, deleteShape, duplicateSelected } = useCanvasStore();
  const { undo, redo } = useCanvasStore.temporal.getState();

  useConvexSync();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      switch (e.key.toLowerCase()) {
        case "v":
          setTool("select");
          break;
        case "r":
          setTool("rectangle");
          break;
        case "o":
          setTool("ellipse");
          break;
        case "delete":
        case "backspace":
          if (selectedId) deleteShape(selectedId);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, setTool, deleteShape, duplicateSelected, undo, redo]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-neutral-900">
        <Toolbar />
        <main className="flex-1 overflow-hidden">
          <Canvas />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
