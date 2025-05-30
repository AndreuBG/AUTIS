import {login} from "../../controllers/authentication.js";

export class User {
    constructor(active, id, name, login, email) {
        this.active = active;
        this.id = id;
        this.name = name;
        this.login = login;
        this.email = email;

    }
}