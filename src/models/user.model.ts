export interface User {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  userType: "Worker" | "CA";
}

class UserModel {
  private users: User[] = [];
  private nextId: number = 1;

  getAll(): User[] {
    return this.users;
  }

  getById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.nextId++,
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userData: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData, id };
      return this.users[index];
    }
    return null;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new UserModel();
