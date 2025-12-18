"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FirmModel {
    constructor() {
        this.firms = [];
        this.nextId = 1;
    }
    getAll() {
        return this.firms;
    }
    getById(id) {
        return this.firms.find(f => f.id === id);
    }
    getByEmail(email) {
        return this.firms.find(f => f.email === email);
    }
    create(firmData) {
        const newFirm = Object.assign(Object.assign({ id: this.nextId++ }, firmData), { status: "Pending", createdAt: new Date() });
        this.firms.push(newFirm);
        return newFirm;
    }
    update(id, firmData) {
        const index = this.firms.findIndex(f => f.id === id);
        if (index !== -1) {
            this.firms[index] = Object.assign(Object.assign(Object.assign({}, this.firms[index]), firmData), { id });
            return this.firms[index];
        }
        return null;
    }
    delete(id) {
        const index = this.firms.findIndex(f => f.id === id);
        if (index !== -1) {
            this.firms.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.default = new FirmModel();
