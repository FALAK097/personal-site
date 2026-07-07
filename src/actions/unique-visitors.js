"use server";

import { z } from "zod";
import { trackUniqueVisitor } from "@/lib/site-data-store";

const UniqueVisitorSchema = z.object({
  visitorId: z
    .string()
    .min(1, "visitorId is required")
    .max(100, "visitorId is too long"),
});

export async function uniqueVisitors(visitorId) {
  try {
    const validated = UniqueVisitorSchema.safeParse({ visitorId });
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const count = await trackUniqueVisitor(validated.data.visitorId);

    return { uniqueVisitors: count };
  } catch (error) {
    console.error("Error in uniqueVisitors server action:", {
      message: error.message,
    });

    return { error: "Failed to track unique visitors" };
  }
}
