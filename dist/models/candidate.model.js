"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CandidateModel {
    constructor() {
        this.candidates = [];
        this.nextId = 1;
    }
    getAll() {
        return this.candidates;
    }
    getById(id) {
        return this.candidates.find(c => c.id === id);
    }
    getByEmail(email) {
        return this.candidates.find(c => c.email === email);
    }
    create(candidateData) {
        const newCandidate = Object.assign(Object.assign({ id: this.nextId++ }, candidateData), { status: "Pending", createdAt: new Date() });
        this.candidates.push(newCandidate);
        return newCandidate;
    }
    update(id, candidateData) {
        const index = this.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
            this.candidates[index] = Object.assign(Object.assign(Object.assign({}, this.candidates[index]), candidateData), { id });
            return this.candidates[index];
        }
        return null;
    }
    delete(id) {
        const index = this.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
            this.candidates.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.default = new CandidateModel();
