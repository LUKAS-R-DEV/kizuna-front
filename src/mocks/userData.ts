// src/mocks/userData.ts
export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

export const USERS_MOCK: IUser[] = [
  { id: 1, name: "Lucas Rafael", email: "lucas@kizuna.com", role: "ADMIN", status: "Active" },
  { id: 2, name: "Maria Silva", email: "maria@kizuna.com", role: "OPERATOR", status: "Active" },
  { id: 3, name: "João Santos", email: "joao@kizuna.com", role: "INSPECTOR", status: "Active" },
  { id: 4, name: "Sarah Williams", email: "sarah.w@kizuna.com", role: "INSPECTOR", status: "Active" },
  { id: 5, name: "Tom Brown", email: "tom.b@kizuna.com", role: "OPERATOR", status: "Inactive" },
];