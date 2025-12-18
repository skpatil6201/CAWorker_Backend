"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserModel {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }
    getAll() {
        return this.users;
    }
    getById(id) {
        return this.users.find(u => u.id === id);
    }
    create(userData) {
        const newUser = Object.assign({ id: this.nextId++ }, userData);
        this.users.push(newUser);
        return newUser;
    }
    update(id, userData) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = Object.assign(Object.assign(Object.assign({}, this.users[index]), userData), { id });
            return this.users[index];
        }
        return null;
    }
    delete(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.default = new UserModel();
