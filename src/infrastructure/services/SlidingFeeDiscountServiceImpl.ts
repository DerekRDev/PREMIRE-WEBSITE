import {
  SlidingFeeDiscount,
  FederalPovertyGuideline,
  PatientDiscountEligibility,
  ApplyForDiscountRequest,
  DiscountApplicationResponse,
  ServiceType
} from '../../core/entities/SlidingFeeDiscount';

import {
  CheckDiscountEligibilityRequest,
  DiscountEligibilityResponse
} from '../../core/entities/Payment';

import { SlidingFeeDiscountService } from '../../core/interfaces/services/SlidingFeeDiscountService';

/**
 * Implementation of the Sliding Fee Discount Service
 */
export class SlidingFeeDiscountServiceImpl implements SlidingFeeDiscountService {
  // In a real application, these would be stored in a database
  private federalPovertyGuidelines: FederalPovertyGuideline[] = [];
  private discountTiers: SlidingFeeDiscount[] = [];
  private patientEligibility: PatientDiscountEligibility[] = [];

  constructor() {
    // Initialize with 2024 FPG data
    this.federalPovertyGuidelines.push({
      year: 2024,
      isActive: true,
      basePovertyLevel: 14580, // 2024 FPL for a household of 1
      additionalPersonAmount: 5140, // Amount added for each additional person
      alaskaMultiplier: 1.25, // Alaska has higher FPL
      hawaiiMultiplier: 1.15, // Hawaii has higher FPL
    });

    // Initialize discount tiers based on Premier Healthcare's sliding scale
    this.initializeDefaultDiscountTiers();
  }

  /**
   * Initialize default discount tiers based on Premier Healthcare's sliding scale
   */
  private initializeDefaultDiscountTiers() {
    // Tier 1: 0-100% FPL - 80% discount (nominal fee)
    this.discountTiers.push({
      id: 'tier-1',
      name: 'Tier 1 (Nominal Fee)',
      tier: 1,
      discountPercentage: 80,
      povertyLevelMin: 0,
      povertyLevelMax: 100,
      isActive: true,
      effectiveDate: new Date('2024-01-01'),
      serviceTypes: ['MEDICAL', 'DENTAL', 'BEHAVIORAL', 'PHARMACY'],
      nominalFees: {
        MEDICAL: 30,
        DENTAL: 40,
        BEHAVIORAL: 25,
        PHARMACY: 10,
        LABORATORY: 15,
        IMAGING: 35,
        PROCEDURE: 50,
        OTHER: 30
      }
    });

    // Tier 2: 101-133% FPL - 60% discount
    this.discountTiers.push({
      id: 'tier-2',
      name: 'Tier 2',
      tier: 2,
      discountPercentage: 60,
      povertyLevelMin: 101,
      povertyLevelMax: 133,
      isActive: true,
      effectiveDate: new Date('2024-01-01'),
      serviceTypes: ['MEDICAL', 'DENTAL', 'BEHAVIORAL', 'PHARMACY']
    });

    // Tier 3: 134-166% FPL - 40% discount
    this.discountTiers.push({
      id: 'tier-3',
      name: 'Tier 3',
      tier: 3,
      discountPercentage: 40,
      povertyLevelMin: 134,
      povertyLevelMax: 166,
      isActive: true,
      effectiveDate: new Date('2024-01-01'),
      serviceTypes: ['MEDICAL', 'DENTAL', 'BEHAVIORAL', 'PHARMACY']
    });

    // Tier 4: 167-200% FPL - 20% discount
    this.discountTiers.push({
      id: 'tier-4',
      name: 'Tier 4',
      tier: 4,
      discountPercentage: 20,
      povertyLevelMin: 167,
      povertyLevelMax: 200,
      isActive: true,
      effectiveDate: new Date('2024-01-01'),
      serviceTypes: ['MEDICAL', 'DENTAL', 'BEHAVIORAL', 'PHARMACY']
    });

    // Tier 5: Above 200% FPL - No discount (full fee)
    this.discountTiers.push({
      id: 'tier-5',
      name: 'Tier 5 (Full Fee)',
      tier: 5,
      discountPercentage: 0,
      povertyLevelMin: 201,
      povertyLevelMax: 999999, // Effectively no upper limit
      isActive: true,
      effectiveDate: new Date('2024-01-01'),
      serviceTypes: ['MEDICAL', 'DENTAL', 'BEHAVIORAL', 'PHARMACY']
    });
  }

  /**
   * Get current Federal Poverty Guidelines
   */
  async getCurrentFPG(): Promise<FederalPovertyGuideline> {
    const currentYear = new Date().getFullYear();
    const currentFPG = this.federalPovertyGuidelines.find(
      fpg => fpg.year === currentYear && fpg.isActive
    );

    if (!currentFPG) {
      // Fall back to most recent
      const mostRecentFPG = [...this.federalPovertyGuidelines]
        .sort((a, b) => b.year - a.year)[0];
      
      if (mostRecentFPG) {
        return mostRecentFPG;
      }
      
      throw new Error('No Federal Poverty Guidelines available');
    }

    return currentFPG;
  }

  /**
   * Get FPG for a specific year
   */
  async getFPGByYear(year: number): Promise<FederalPovertyGuideline> {
    const fpg = this.federalPovertyGuidelines.find(g => g.year === year);
    if (!fpg) {
      throw new Error(`Federal Poverty Guidelines for year ${year} not found`);
    }
    return fpg;
  }

  /**
   * Calculate the Federal Poverty Level percentage for a household
   */
  async calculateFPLPercentage(
    annualIncome: number,
    householdSize: number,
    state?: string
  ): Promise<number> {
    if (householdSize < 1) {
      throw new Error('Household size must be at least 1');
    }

    if (annualIncome < 0) {
      throw new Error('Annual income cannot be negative');
    }

    const fpg = await this.getCurrentFPG();
    
    // Calculate the poverty level threshold for this household size
    let householdThreshold = fpg.basePovertyLevel + (householdSize - 1) * fpg.additionalPersonAmount;
    
    // Apply state multipliers if applicable
    if (state) {
      const stateUpper = state.toUpperCase();
      if (stateUpper === 'AK') {
        householdThreshold *= fpg.alaskaMultiplier;
      } else if (stateUpper === 'HI') {
        householdThreshold *= fpg.hawaiiMultiplier;
      }
    }
    
    // Calculate percentage of FPL
    const fplPercentage = (annualIncome / householdThreshold) * 100;
    
    // Round to nearest whole number
    return Math.round(fplPercentage);
  }

  /**
   * Get all active discount tiers
   */
  async getDiscountTiers(): Promise<SlidingFeeDiscount[]> {
    return this.discountTiers.filter(tier => tier.isActive);
  }

  /**
   * Determine the discount tier for a patient based on income and household size
   */
  async determineDiscountTier(
    annualIncome: number,
    householdSize: number,
    state?: string
  ): Promise<SlidingFeeDiscount | null> {
    const fplPercentage = await this.calculateFPLPercentage(
      annualIncome,
      householdSize,
      state
    );
    
    const activeTiers = await this.getDiscountTiers();
    
    for (const tier of activeTiers) {
      if (
        fplPercentage >= tier.povertyLevelMin &&
        fplPercentage <= tier.povertyLevelMax
      ) {
        return tier;
      }
    }
    
    return null;
  }

  /**
   * Apply for sliding fee discount
   */
  async applyForDiscount(
    request: ApplyForDiscountRequest
  ): Promise<DiscountApplicationResponse> {
    try {
      // Determine discount tier
      const discountTier = await this.determineDiscountTier(
        request.annualIncome,
        request.householdSize
      );
      
      if (!discountTier) {
        return {
          message: 'No eligible discount tier found for the provided information',
          success: false,
          nextSteps: ['Review income and household size information']
        };
      }
      
      // Create verification documents
      const verificationDocuments = request.verificationDocuments.map(doc => ({
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: doc.type,
        documentUrl: doc.documentUrl,
        uploadDate: new Date(),
        verified: false,
        notes: doc.notes
      }));
      
      // Create eligibility record
      const eligibility: PatientDiscountEligibility = {
        id: `elig-${Date.now()}`,
        patientId: request.patientId,
        householdSize: request.householdSize,
        annualIncome: request.annualIncome,
        discountTier: discountTier.tier,
        discountPercentage: discountTier.discountPercentage,
        verificationDocuments,
        effectiveDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        status: 'PENDING',
        notes: request.notes
      };
      
      // Store the eligibility record (in a real app, this would be saved to a database)
      this.patientEligibility.push(eligibility);
      
      return {
        eligibility,
        message: 'Discount application submitted successfully',
        success: true,
        nextSteps: [
          'Your application is pending verification',
          'You will be notified when your application is approved'
        ]
      };
    } catch (error) {
      console.error('Error applying for discount:', error);
      return {
        message: `Error applying for discount: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
        nextSteps: ['Please contact our support team for assistance']
      };
    }
  }

  /**
   * Check if a patient is eligible for a discount
   */
  async checkDiscountEligibility(
    request: CheckDiscountEligibilityRequest
  ): Promise<DiscountEligibilityResponse> {
    try {
      // First check if patient has an existing approved eligibility
      const existingEligibility = this.patientEligibility.find(
        e => e.patientId === request.patientId && 
          e.status === 'APPROVED' && 
          e.expirationDate > new Date()
      );
      
      if (existingEligibility) {
        // Find the discount tier
        const tier = this.discountTiers.find(t => t.tier === existingEligibility.discountTier);
        
        if (tier) {
          // Calculate discounted amount
          const discountedAmount = await this.calculateDiscountedAmount(
            request.originalAmount,
            tier.tier,
            request.serviceType as ServiceType
          );
          
          return {
            eligible: true,
            discountTier: tier.tier,
            discountPercentage: tier.discountPercentage,
            discountedAmount,
            originalAmount: request.originalAmount,
            message: `Patient is eligible for a ${tier.discountPercentage}% discount`
          };
        }
      }
      
      // If no existing eligibility, check based on provided info
      if (request.householdSize && request.annualIncome) {
        const tier = await this.determineDiscountTier(
          request.annualIncome,
          request.householdSize
        );
        
        if (tier) {
          // Calculate discounted amount
          const discountedAmount = await this.calculateDiscountedAmount(
            request.originalAmount,
            tier.tier,
            request.serviceType as ServiceType
          );
          
          return {
            eligible: tier.discountPercentage > 0,
            discountTier: tier.tier,
            discountPercentage: tier.discountPercentage,
            discountedAmount,
            originalAmount: request.originalAmount,
            message: tier.discountPercentage > 0
              ? `Patient may be eligible for a ${tier.discountPercentage}% discount pending verification`
              : 'Patient does not qualify for a discount based on provided information'
          };
        }
      }
      
      // Default response if no eligibility found
      return {
        eligible: false,
        originalAmount: request.originalAmount,
        message: 'Patient is not currently eligible for a discount'
      };
    } catch (error) {
      console.error('Error checking discount eligibility:', error);
      return {
        eligible: false,
        originalAmount: request.originalAmount,
        message: `Error checking discount eligibility: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Calculate discounted amount for a service
   */
  async calculateDiscountedAmount(
    originalAmount: number,
    discountTier: number,
    serviceType: ServiceType
  ): Promise<number> {
    const tier = this.discountTiers.find(t => t.tier === discountTier);
    
    if (!tier) {
      throw new Error(`Discount tier ${discountTier} not found`);
    }
    
    // If service has a nominal fee, use that instead of percentage
    if (tier.nominalFees && tier.nominalFees[serviceType]) {
      return tier.nominalFees[serviceType]!;
    }
    
    // Otherwise apply percentage discount
    const discountAmount = (originalAmount * tier.discountPercentage) / 100;
    return originalAmount - discountAmount;
  }

  /**
   * Get a patient's current discount eligibility
   */
  async getPatientDiscountEligibility(
    patientId: string
  ): Promise<PatientDiscountEligibility | null> {
    // Find the most recent approved eligibility
    const eligibilities = this.patientEligibility
      .filter(e => e.patientId === patientId && e.status === 'APPROVED')
      .sort((a, b) => b.approvalDate!.getTime() - a.approvalDate!.getTime());
    
    return eligibilities.length > 0 ? eligibilities[0] : null;
  }

  /**
   * Update Federal Poverty Guidelines for a new year
   */
  async updateFederalPovertyGuidelines(
    fpg: FederalPovertyGuideline
  ): Promise<FederalPovertyGuideline> {
    // Deactivate any existing FPG for the same year
    this.federalPovertyGuidelines = this.federalPovertyGuidelines.map(g => {
      if (g.year === fpg.year) {
        return { ...g, isActive: false };
      }
      return g;
    });
    
    // Add the new FPG
    this.federalPovertyGuidelines.push(fpg);
    
    return fpg;
  }

  /**
   * Update discount tier
   */
  async updateDiscountTier(
    discountTier: SlidingFeeDiscount
  ): Promise<SlidingFeeDiscount> {
    // Update an existing tier or add a new one
    const existingIndex = this.discountTiers.findIndex(t => t.id === discountTier.id);
    
    if (existingIndex >= 0) {
      this.discountTiers[existingIndex] = discountTier;
    } else {
      this.discountTiers.push(discountTier);
    }
    
    return discountTier;
  }
}