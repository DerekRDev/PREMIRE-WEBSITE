/**
 * Represents a referral in the Premier Healthcare platform
 */
export interface Referral {
  id: string;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
  status: ReferralStatus;
  referringProviderId: string;
  receivingProviderId: string;
  specialtyType: string;
  reason: string;
  notes?: string;
  urgencyLevel: UrgencyLevel;
  appointmentId?: string;
  documentIds?: string[];
  auditTrail: ReferralStatusChange[];
}

/**
 * The possible statuses a referral can have
 */
export type ReferralStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED';

/**
 * The urgency level for a referral
 */
export type UrgencyLevel = 
  | 'ROUTINE'
  | 'URGENT'
  | 'EMERGENCY';

/**
 * Represents a status change in the referral audit trail
 */
export interface ReferralStatusChange {
  fromStatus: ReferralStatus;
  toStatus: ReferralStatus;
  changedAt: Date;
  changedBy: string;
  notes?: string;
}

/**
 * The request for creating a new referral
 */
export interface CreateReferralRequest {
  patientId: string;
  referringProviderId: string;
  receivingProviderId: string;
  specialtyType: string;
  reason: string;
  notes?: string;
  urgencyLevel: UrgencyLevel;
  documentIds?: string[];
}

/**
 * The response for a created referral
 */
export interface ReferralResponse {
  referral: Referral;
  message: string;
  success: boolean;
}