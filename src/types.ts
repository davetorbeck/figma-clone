export interface Shape {
  id: string;
  type: "rectangle" | "ellipse";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export type Tool = "select" | "rectangle" | "ellipse";

export interface Point {
  x: number;
  y: number;
}
