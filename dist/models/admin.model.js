"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminModel {
    constructor() {
        this.admins = [
            {
                id: 1,
                username: "admin",
                email: "admin@skassociates.com",
                password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G", // admin123 hashed
                role: "SuperAdmin",
                createdAt: new Date()
            }
        ];
        this.nextId = 2;
    }
    getAll() {
        return this.admins;
    }
    getById(id) {
        return this.admins.find(a => a.id === id);
    }
    getByEmail(email) {
        return this.admins.find(a => a.email === email);
    }
    getByUsername(username) {
        return this.admins.find(a => a.username === username);
    }
    create(adminData) {
        const newAdmin = Object.assign(Object.assign({ id: this.nextId++ }, adminData), { createdAt: new Date() });
        this.admins.push(newAdmin);
        return newAdmin;
    }
    update(id, adminData) {
        const index = this.admins.findIndex(a => a.id === id);
        if (index !== -1) {
            this.admins[index] = Object.assign(Object.assign(Object.assign({}, this.admins[index]), adminData), { id });
            return this.admins[index];
        }
        return null;
    }
    delete(id) {
        const index = this.admins.findIndex(a => a.id === id);
        if (index !== -1) {
            this.admins.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.default = new AdminModel();
