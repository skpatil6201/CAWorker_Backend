export interface Candidate {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  mobileNumber: string;
  email: string;
  password: string;
  address: string;
  highestQualification: string;
  certifications: string;
  yearsOfExperience: "0-1" | "1-3" | "3-5" | "5+";
  currentPreviousEmployer: string;
  positionHeld: string;
  areasOfExpertise: string[];
  softwareProficiency: string[];
  otherSoftware?: string;
  documents: string[];
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
}

class CandidateModel {
  private candidates: Candidate[] = [];
  private nextId: number = 1;

  getAll(): Candidate[] {
    return this.candidates;
  }

  getById(id: number): Candidate | undefined {
    return this.candidates.find(c => c.id === id);
  }

  getByEmail(email: string): Candidate | undefined {
    return this.candidates.find(c => c.email === email);
  }

  create(candidateData: Omit<Candidate, 'id' | 'createdAt' | 'status'>): Candidate {
    const newCandidate: Candidate = {
      id: this.nextId++,
      ...candidateData,
      status: "Pending",
      createdAt: new Date()
    };
    this.candidates.push(newCandidate);
    return newCandidate;
  }

  update(id: number, candidateData: Partial<Candidate>): Candidate | null {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index !== -1) {
      this.candidates[index] = { ...this.candidates[index], ...candidateData, id };
      return this.candidates[index];
    }
    return null;
  }

  delete(id: number): boolean {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index !== -1) {
      this.candidates.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new CandidateModel();