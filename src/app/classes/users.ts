import { getRoles, Users } from "../models/users";


export class User {
    _id?: number;
    image?: string;
    lastname!: string;
    firstname!: string;
    email!: string;
    token!: string;
    role?: getRoles[];

    constructor(user?: Users) {
        Object.assign(this, user);
    }

    get fullName() {
        if (this.lastname != null) {
            return `${this.firstname} ${this.firstname}`;
        } else {
            return this.lastname;
        }
    }
}
