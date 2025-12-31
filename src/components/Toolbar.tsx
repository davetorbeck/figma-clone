import { MousePointer2, Square, Circle, ChevronDown, Layers, Search, Palette } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/ColorPicker";
import { useCanvasStore } from "@/store";
import type { Tool } from "@/types";
import { cn } from "@/lib/utils";

const tools: { id: Tool; icon: typeof MousePointer2; label: string; shortcut: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
  { id: "ellipse", icon: Circle, label: "Ellipse", shortcut: "O" },
];

export function Toolbar() {
  const { shapes, selectedId, tool, zoom, setTool, setColor } = useCanvasStore();
  const selectedShape = shapes.find((s) => s.id === selectedId);

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="flex h-[52px] items-center justify-center px-2">
        <button className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background hover:bg-accent hover:text-accent-foreground">
          <div className="flex size-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
            F
          </div>
          <span className="flex-1 truncate text-left">Figma Clone</span>
          <ChevronDown className="size-4 opacity-50" />
        </button>
      </SidebarHeader>

      <Separator className="bg-border" />

      <SidebarContent>
        <div className="flex flex-col gap-4 py-2">
          <nav className="grid gap-1 px-2">
            {tools.map((t) => (
              <button
                key={t.id}
                className={cn(
                  "inline-flex h-8 items-center justify-start gap-2 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors",
                  tool === t.id
                    ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setTool(t.id)}
              >
                <t.icon className="mr-2 size-4" />
                {t.label}
                <span
                  className={cn(
                    "ml-auto font-mono text-[10px]",
                    tool === t.id ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {t.shortcut}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <Separator className="bg-border" />

        <div className="flex flex-col gap-4 py-2">
          <nav className="grid gap-1 px-2">
            <div className="inline-flex h-8 items-center justify-start gap-2 rounded-md px-3 text-xs font-medium">
              <Layers className="mr-2 size-4" />
              Shapes
              <span className="ml-auto text-muted-foreground">{shapes.length}</span>
            </div>
            <div className="inline-flex h-8 items-center justify-start gap-2 rounded-md px-3 text-xs font-medium">
              <Search className="mr-2 size-4" />
              Zoom
              <span className="ml-auto text-muted-foreground">{Math.round(zoom * 100)}%</span>
            </div>
          </nav>
        </div>

        {selectedShape && (
          <>
            <Separator className="bg-border" />
            <div className="flex flex-col gap-4 py-2">
              <nav className="grid gap-1 px-2">
                <div className="inline-flex h-8 items-center justify-start gap-2 rounded-md px-3 text-xs font-medium">
                  <Palette className="mr-2 size-4" />
                  Fill Color
                </div>
                <div className="px-3">
                  <ColorPicker color={selectedShape.fill} onChange={setColor} />
                </div>
              </nav>
            </div>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
