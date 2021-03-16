import { getRoles, Users } from "../models/users";


export class User {
    _id?: string;
    image?: string;
    lastname!: string;
    firstname!: string;
    email!: string;
    token!: string;
    role: getRoles;

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
}
