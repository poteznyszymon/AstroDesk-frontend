export type EquipmentType = "laptop" | "desktop" | "monitor" | "printer" | "phone" | "server" | "other";
export type EquipmentStatus = "active" | "in-repair" | "available" | "retired";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber: string;
  status: EquipmentStatus;
  assignedTo: string | null;
  location: string;
  assignedDate: string | null;
}
