import z from "zod";
import { ticketPriorities } from "./tickets";

export const createTicketSchema = z.object({
  title: z.string().min(1, "Tytuł nie może być pusty"),
  description: z.string().min(1, "Opis nie może być pusty"),
  priority: z.enum(ticketPriorities),
  linkedInventoryId: z.number().nullable().optional(),
});

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
