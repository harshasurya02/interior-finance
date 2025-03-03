import { z } from "zod";

const projectSchema = z.object({
  site_name: z.string().min(1),
  expenses: z.number().min(0),
  incoming: z.number().min(0),
  initial_quotation: z.number().min(0),
  final_quotation: z.number().min(0),
  site_status_id: z.string().min(1),
});
export {projectSchema}
export type Project = z.infer<typeof projectSchema>;
