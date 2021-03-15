export interface Users {
    _id?: string;
    image?: string;
    lastname: string;
    firstname: string;
    email: string;
    token: string;
}

export type getRoles = 'FREEMIUM' | 'PREMIUM' | 'ADMIN' | 'USER';
