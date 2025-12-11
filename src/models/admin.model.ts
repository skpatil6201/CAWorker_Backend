export interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "SuperAdmin" | "Admin";
  createdAt: Date;
}

class AdminModel {
  private admins: Admin[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@skassociates.com",
      password: "admin123",
      role: "SuperAdmin",
      createdAt: new Date()
    }
  ];
  private nextId: number = 2;

  getAll(): Admin[] {
    return this.admins;
  }

  getById(id: number): Admin | undefined {
    return this.admins.find(a => a.id === id);
  }

  getByEmail(email: string): Admin | undefined {
    return this.admins.find(a => a.email === email);
  }

  getByUsername(username: string): Admin | undefined {
    return this.admins.find(a => a.username === username);
  }

  create(adminData: Omit<Admin, 'id' | 'createdAt'>): Admin {
    const newAdmin: Admin = {
      id: this.nextId++,
      ...adminData,
      createdAt: new Date()
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  update(id: number, adminData: Partial<Admin>): Admin | null {
    const index = this.admins.findIndex(a => a.id === id);
    if (index !== -1) {
      this.admins[index] = { ...this.admins[index], ...adminData, id };
      return this.admins[index];
    }
    return null;
  }

  delete(id: number): boolean {
    const index = this.admins.findIndex(a => a.id === id);
    if (index !== -1) {
      this.admins.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new AdminModel();