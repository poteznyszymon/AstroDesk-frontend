import { z } from "zod";
import { ticketPriorities } from "./tickets";

export const editTicketSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  priority: z.enum(ticketPriorities),
});

export type EditTicketSchema = z.infer<typeof editTicketSchema>;
