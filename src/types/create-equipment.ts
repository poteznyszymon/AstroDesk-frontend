import { z } from "zod";
import { type EquipmentType, type EquipmentStatus } from "./equipment";

export const equipmentTypes: EquipmentType[] = [
    "laptop",
    "desktop",
    "monitor",
    "printer",
    "phone",
    "server",
    "other",
];

export const equipmentStatuses: EquipmentStatus[] = [
    "active",
    "available",
    "in-repair",
    "retired",
];

export const createEquipmentSchema = z.object({
    name: z.string().min(1, "Nazwa jest wymagana"),
    type: z.enum(["laptop", "desktop", "monitor", "printer", "phone", "server", "other"]),
    serialNumber: z.string().min(1, "Numer seryjny jest wymagany"),
    status: z.enum(["active", "available", "in-repair", "retired"]),
    location: z.string().min(1, "Lokalizacja jest wymagana"),
    assignedTo: z.string().optional().or(z.literal("")),
    assignedDate: z.string().optional().or(z.literal("")),
});

export type CreateEquipmentSchema = z.infer<typeof createEquipmentSchema>;