export type UserRole = "GESTOR" | "PROFISSIONAL" | "CLIENTE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
