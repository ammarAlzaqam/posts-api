import z from "zod";

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().min(1),
  limit: z.coerce.number().refine((value) => [5, 10, 20].includes(value), {
    message: "Invalid limit value. Allowed values are 5, 10, or 20.",
  }),
  sort: z.coerce.number().refine((value) => [1, -1].includes(value), {
    message: "Invalid sort value. Allowed values are 5, 10, or 20.",
  }),
});
