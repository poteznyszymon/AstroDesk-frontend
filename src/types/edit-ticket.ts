import { z } from "zod";
import { ticketStatuses, ticketPriorities } from "./tickets";

export const editTicketSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  status: z.enum(ticketStatuses),
  priority: z.enum(ticketPriorities),
  assignee: z.string().nullable(),
  linkedInventoryId: z.number().nullable().optional(),
});

export type EditTicketSchema = z.infer<typeof editTicketSchema>;