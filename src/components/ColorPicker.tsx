import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full h-10 rounded-md border border-neutral-700 cursor-pointer"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 bg-neutral-900 border-neutral-700">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
