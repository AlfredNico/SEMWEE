import { Projects } from "@app/user-spaces/dashbord/interfaces/projects";

export interface Users {
  _id?: string;
  image?: string;
  lastname: string;
  firstname: string;
  email: string;
  token: string;
  // projet: userProject[];
  role: getRoles[];
  understand?: number;
}
export interface userProject {
  name_project: string;
  _id: string;
  understand: number;
}

export type getRoles = 'FREEMIUM' | 'PREMIUM' | 'ADMIN' | 'USER';
