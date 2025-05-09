import { z } from "zod";

export const reviewSchema = z.object({
    order_id: z
        .number()
        .gt(0),
    rating: z
        .number()
        .min(1, "Rating is required")
        .max(5, "Rating cannot exceed 5"),
    comment: z
        .string(),
    photos: z
        .instanceof(FileList)
        .refine((files) => files.length <= 3, {
            message: "You can upload a maximum of 3 photos",
        })
        .refine((files) => {
            for (let i = 0; i < files.length; i++) {
            if (!files[i].type.startsWith("image/")) {
                return false;
            }
            }
            return true;
        }, "All files must be images")
        .refine((files) => {
            // Check file size (max 5MB each)
            for (let i = 0; i < files.length; i++) {
            if (files[i].size > 5 * 1024 * 1024) {
                return false;
            }
            }
            return true;
        }, "Each file must be less than 5MB")
        .optional(),
  });

  export type ReviewData = z.infer<typeof reviewSchema>