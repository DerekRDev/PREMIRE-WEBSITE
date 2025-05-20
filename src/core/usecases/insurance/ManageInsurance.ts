import { InsuranceInfo } from '../../entities/InsuranceInfo';

// This interface represents a repository for managing insurance information
// In a real implementation, this would be defined in interfaces/repositories
interface InsuranceRepository {
  findById(id: string): Promise<InsuranceInfo | null>;
  findByPatientId(patientId: string): Promise<InsuranceInfo[]>;
  create(insurance: Omit<InsuranceInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<InsuranceInfo>;
  update(id: string, insurance: Partial<InsuranceInfo>): Promise<InsuranceInfo>;
  delete(id: string): Promise<boolean>;
  setPrimary(id: string, patientId: string): Promise<boolean>;
}

export class ManageInsuranceUseCase {
  constructor(
    private insuranceRepository: InsuranceRepository
  ) {}

  /**
   * Get insurance information by ID
   */
  async getInsuranceById(id: string): Promise<InsuranceInfo | null> {
    return this.insuranceRepository.findById(id);
  }

  /**
   * Get all insurance information for a patient
   */
  async getPatientInsurance(patientId: string): Promise<InsuranceInfo[]> {
    return this.insuranceRepository.findByPatientId(patientId);
  }

  /**
   * Add new insurance information
   */
  async addInsurance(
    patientId: string,
    insurance: Omit<InsuranceInfo, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>
  ): Promise<InsuranceInfo> {
    const patientInsurance = await this.getPatientInsurance(patientId);
    
    // If this is the first insurance, make it primary
    const isPrimary = patientInsurance.length === 0;
    
    const newInsurance = await this.insuranceRepository.create({
      ...insurance,
      patientId,
      isPrimary
    });
    
    return newInsurance;
  }

  /**
   * Update insurance information
   */
  async updateInsurance(
    id: string,
    updates: Partial<InsuranceInfo>
  ): Promise<InsuranceInfo> {
    return this.insuranceRepository.update(id, updates);
  }

  /**
   * Delete insurance information
   */
  async deleteInsurance(id: string): Promise<boolean> {
    return this.insuranceRepository.delete(id);
  }

  /**
   * Set insurance as primary
   */
  async setPrimaryInsurance(id: string, patientId: string): Promise<boolean> {
    return this.insuranceRepository.setPrimary(id, patientId);
  }
}