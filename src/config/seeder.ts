import Admin from '../models/admin.model';
import { hashPassword } from '../utils/auth';

export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@skassociates.com' });
    
    if (!existingAdmin) {
      // Create default admin
      const hashedPassword = await hashPassword('admin123');
      
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@skassociates.com',
        password: hashedPassword,
        role: 'SuperAdmin'
      });
      
      await defaultAdmin.save();
      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@skassociates.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️  Default admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};