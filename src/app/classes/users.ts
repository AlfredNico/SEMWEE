import { getRoles, userProject, Users } from "../models/users";


export class User {
    _id?: string;
    image?: string;
    lastname!: string;
    firstname!: string;
    email!: string;
    token!: string;
    role: getRoles[];
    projet: userProject[];

    constructor(user?: Users) {
        Object.assign(this, user);
    }

    get fullname() {
        if (this.lastname != null) {
            return `${this.firstname} ${this.lastname}`;
        } else {
            return this.lastname;
        }
    }

    get projets() {
        return JSON.parse(this.projet as any);
    }

    get roles() {
        switch (true) {
            case this.role.includes('ADMIN'):
                return 'ADMIN'
            case this.role.includes('FREEMIUM'):
                return 'FREEMIUM'
            case this.role.includes('PREMIUM'):
                return 'PREMIUM'
            case this.role.includes('USER'):
                return 'USER'
        }
    }
}
