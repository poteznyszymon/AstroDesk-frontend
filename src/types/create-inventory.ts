import { z } from "zod";

export const createInventorySchema = z.object({
    name: z.string().min(1, "Nazwa jest wymagana"),
    itemType: z.enum([
        "LAPTOP", "KOMPUTER", "DRUKARKA", "ROUTER", "SWITCH", "TELEFON", "SFP"
    ], { message: "Typ jest wymagany" }),
    serialNumber: z.string().min(1, "Numer seryjny jest wymagany"),
    inventoryNumber: z.string().nullable().optional(),
    status: z.enum([
        "DOSTEPNE", "DO_WYDANIA", "WYDANE", "WYPORZYCZONE", "W_TRAKCIE", "SERWIS", "UTYLIZACJA"
    ], { message: "Status jest wymagany" }),
    model: z.string().nullable().optional(),
    boughtDate: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    invoiceNumber: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    port: z.string().nullable().optional(),
});

export type CreateInventorySchema = z.infer<typeof createInventorySchema>;
