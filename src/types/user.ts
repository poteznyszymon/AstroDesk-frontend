export type UserRole = "USER" | "TICKET_ADMIN" | "ASSET_ADMIN" | "HEADADMIN";

export type User = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};
