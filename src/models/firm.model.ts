export interface Partner {
  name: string;
  qualification: string;
  membershipNo: string;
  designation: string;
  contact: string;
}

export interface Firm {
  id: number;
  firmName: string;
  registrationNumber: string;
  dateOfRegistration: string;
  panGstNumber: string;
  firmType: "Partnership" | "LLP" | "Private Ltd" | "Others";
  firmTypeOther?: string;
  headOfficeAddress: string;
  cityStatePin: string;
  firmContactNumber: string;
  email: string;
  password: string;
  website?: string;
  partners: Partner[];
  areasOfPractice: string[];
  otherPracticeArea?: string;
  documents: string[];
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
}

class FirmModel {
  private firms: Firm[] = [];
  private nextId: number = 1;

  getAll(): Firm[] {
    return this.firms;
  }

  getById(id: number): Firm | undefined {
    return this.firms.find(f => f.id === id);
  }

  getByEmail(email: string): Firm | undefined {
    return this.firms.find(f => f.email === email);
  }

  create(firmData: Omit<Firm, 'id' | 'createdAt' | 'status'>): Firm {
    const newFirm: Firm = {
      id: this.nextId++,
      ...firmData,
      status: "Pending",
      createdAt: new Date()
    };
    this.firms.push(newFirm);
    return newFirm;
  }

  update(id: number, firmData: Partial<Firm>): Firm | null {
    const index = this.firms.findIndex(f => f.id === id);
    if (index !== -1) {
      this.firms[index] = { ...this.firms[index], ...firmData, id };
      return this.firms[index];
    }
    return null;
  }

  delete(id: number): boolean {
    const index = this.firms.findIndex(f => f.id === id);
    if (index !== -1) {
      this.firms.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new FirmModel();