import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const shapeValidator = v.object({
  id: v.string(),
  type: v.union(v.literal("rectangle"), v.literal("ellipse")),
  x: v.number(),
  y: v.number(),
  width: v.number(),
  height: v.number(),
  fill: v.string(),
});

export default defineSchema({
  canvasState: defineTable({
    shapes: v.array(shapeValidator),
    zoom: v.number(),
    offsetX: v.number(),
    offsetY: v.number(),
    updatedAt: v.optional(v.number()),
  }),
});
