import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { shapeValidator } from "./schema";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("canvasState").first();
  },
});

export const save = mutation({
  args: {
    shapes: v.array(shapeValidator),
    zoom: v.number(),
    offsetX: v.number(),
    offsetY: v.number(),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("canvasState").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("canvasState", args);
  },
});
