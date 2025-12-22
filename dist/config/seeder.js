"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const auth_1 = require("../utils/auth");
const seedDatabase = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await admin_model_1.default.findOne({ email: 'admin@skassociates.com' });
        if (!existingAdmin) {
            // Create default admin
            const hashedPassword = await (0, auth_1.hashPassword)('admin123');
            const defaultAdmin = new admin_model_1.default({
                username: 'admin',
                email: 'admin@skassociates.com',
                password: hashedPassword,
                role: 'SuperAdmin'
            });
            await defaultAdmin.save();
            console.log('✅ Default admin user created');
            console.log('📧 Email: admin@skassociates.com');
            console.log('🔑 Password: admin123');
        }
        else {
            console.log('ℹ️  Default admin user already exists');
        }
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
};
exports.seedDatabase = seedDatabase;
