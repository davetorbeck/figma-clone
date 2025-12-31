import { MousePointer2, Square, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/ColorPicker";
import { useCanvasStore } from "@/store";
import type { Tool } from "@/types";
import { cn } from "@/lib/utils";

const tools: { id: Tool; icon: typeof MousePointer2; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "ellipse", icon: Circle, label: "Ellipse" },
];

export function Toolbar() {
  const { shapes, selectedId, tool, zoom, setTool, setColor } = useCanvasStore();
  const selectedShape = shapes.find((s) => s.id === selectedId);

  return (
    <Sidebar className="border-r border-neutral-800">
      <SidebarHeader className="p-4">
        <h1 className="text-lg font-semibold text-white">Figma Clone</h1>
      </SidebarHeader>
      <Separator className="bg-neutral-800" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-400">Tools</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1 p-2">
            {tools.map((t) => (
              <Button
                key={t.id}
                variant="ghost"
                className={cn(
                  "justify-start gap-2 text-neutral-300 hover:text-white hover:bg-neutral-800",
                  tool === t.id && "bg-neutral-800 text-white",
                )}
                onClick={() => setTool(t.id)}
              >
                <t.icon className="size-4" />
                {t.label}
              </Button>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="bg-neutral-800" />
        {selectedShape && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-neutral-400">Fill Color</SidebarGroupLabel>
              <SidebarGroupContent className="p-2">
                <ColorPicker color={selectedShape.fill} onChange={setColor} />
              </SidebarGroupContent>
            </SidebarGroup>
            <Separator className="bg-neutral-800" />
          </>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-400">View</SidebarGroupLabel>
          <SidebarGroupContent className="p-2 text-sm text-neutral-300">
            <div className="flex justify-between items-center">
              <span>Zoom</span>
              <span className="text-neutral-400">{Math.round(zoom * 100)}%</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="bg-neutral-800" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-400">Shortcuts</SidebarGroupLabel>
          <SidebarGroupContent className="p-2 text-xs text-neutral-500 space-y-1">
            <div className="flex justify-between">
              <span>Select</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">V</kbd>
            </div>
            <div className="flex justify-between">
              <span>Rectangle</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">R</kbd>
            </div>
            <div className="flex justify-between">
              <span>Ellipse</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">O</kbd>
            </div>
            <div className="flex justify-between">
              <span>Zoom</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Cmd+Scroll</kbd>
            </div>
            <div className="flex justify-between">
              <span>Pan</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Space+Drag</kbd>
            </div>
            <div className="flex justify-between">
              <span>Undo</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Cmd+Z</kbd>
            </div>
            <div className="flex justify-between">
              <span>Redo</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Cmd+Shift+Z</kbd>
            </div>
            <div className="flex justify-between">
              <span>Duplicate</span>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Cmd+D</kbd>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
