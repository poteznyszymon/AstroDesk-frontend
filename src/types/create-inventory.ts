import { z } from "zod";

export const createInventorySchema = z.object({
    name: z.string().min(1, "Nazwa jest wymagana"),
    itemType: z.enum([
        "LAPTOP", "KOMPUTER", "DRUKARKA", "ROUTER", "SWITCH", "TELEFON"
    ], { message: "Typ jest wymagany" }),
    serialNumber: z.string().min(1, "Numer seryjny jest wymagany"),
    status: z.enum([
        "DO_WYDANIA", "WYDANE", "DOSTEPNE", "ZAJETE", "W_TRAKCIE", 
        "CANCELLED", "PRZYJETY", "SERWIS", "UTYLIZACJA"
    ], { message: "Status jest wymagany" }),
    model: z.string().nullable().optional(),
    boughtDate: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    invoiceNumber: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    assignedTo: z.string().nullable().optional(),
    assignedDate: z.string().nullable().optional(),
});

export type CreateInventorySchema = z.infer<typeof createInventorySchema>;