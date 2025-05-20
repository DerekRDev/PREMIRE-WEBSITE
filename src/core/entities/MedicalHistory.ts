/**
 * Medical history information for a patient
 */
export interface MedicalHistory {
  id: string;
  patientId: string;
  allergies: {
    hasAllergies: boolean;
    items: Array<{
      name: string;
      reaction: string;
      severity: 'mild' | 'moderate' | 'severe';
    }>;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    reason: string;
  }>;
  conditions: string[];
  surgeries: Array<{
    procedure: string;
    date: string;
    notes?: string;
  }>;
  familyHistory: Record<string, boolean>;
  socialHistory: {
    smokingStatus: 'never' | 'former' | 'current';
    alcoholUse: 'none' | 'occasional' | 'moderate' | 'heavy';
    exerciseFrequency: 'none' | 'occasional' | 'regular' | 'daily';
  };
  lastUpdatedAt: Date;
  createdAt: Date;
}
