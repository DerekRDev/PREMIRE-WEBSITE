import { Patient } from '../../entities/Patient';

export interface PatientRepository {
  findById(id: string): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
  findByEmail(email: string): Promise<Patient | null>;
  create(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient>;
  update(id: string, patient: Partial<Patient>): Promise<Patient>;
  delete(id: string): Promise<boolean>;
}