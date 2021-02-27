export class Users {
    id: number;
    firstName: string;
    lastName: string;

    constructor(id: number, firstName: string, lastName: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get fullName() {
        if (this.lastName != null) {
            return `${this.firstName} ${this.lastName}`;
        } else {
            return this.lastName;
        }
    }
}
