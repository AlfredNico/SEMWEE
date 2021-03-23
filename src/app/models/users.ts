export interface Users {
    _id?: string;
    image?: string;
    lastname: string;
    firstname: string;
    email: string;
    token: string;
    projet: Array<any>;
    role: getRoles;
}

export type getRoles = 'FREEMIUM' | 'PREMIUM' | 'ADMIN' | 'USER';
