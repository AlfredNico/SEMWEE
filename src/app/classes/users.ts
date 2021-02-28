import { Users } from "../models/users";


export class User {
    id?: number;
    firstName!: string;
    lastName!: string;

    constructor(user?: Users) {
        Object.assign(this, user);
    }

    get fullName() {
        if (this.lastName != null) {
            return `${this.firstName} ${this.lastName}`;
        } else {
            return this.lastName;
        }
    }
}
