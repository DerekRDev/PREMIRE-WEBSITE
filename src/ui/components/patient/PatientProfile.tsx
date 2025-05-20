import React, { useState } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Tabs } from '../../design-system/components/Tabs';
import { Patient } from '../../../core/entities/Patient';
import { PatientRegistrationForm, PatientRegistrationFormData } from './PatientRegistrationForm';

interface PatientProfileSummaryProps {
  patient: Patient;
  onEdit: () => void;
}

const PatientProfileSummary: React.FC<PatientProfileSummaryProps> = ({ patient, onEdit }) => {
  // Format date of birth for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-800">
          Personal Information
        </h3>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-500 mb-1">Name</p>
          <p className="font-medium text-neutral-800">
            {patient.firstName} {patient.middleName ? `${patient.middleName} ` : ''}{patient.lastName}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-neutral-500 mb-1">Date of Birth</p>
          <p className="font-medium text-neutral-800">
            {formatDate(patient.dateOfBirth)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-neutral-500 mb-1">Gender</p>
          <p className="font-medium text-neutral-800 capitalize">
            {patient.gender === 'prefer-not-to-say' ? 'Prefer not to say' : patient.gender}
          </p>
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-neutral-800 pt-4 border-t border-neutral-200">
        Contact Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-500 mb-1">Email</p>
          <p className="font-medium text-neutral-800">
            {patient.email}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-neutral-500 mb-1">Phone</p>
          <p className="font-medium text-neutral-800">
            {patient.phone}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-neutral-500 mb-1">Preferred Contact</p>
          <p className="font-medium text-neutral-800 capitalize">
            {patient.preferredContactMethod}
          </p>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <p className="text-sm text-neutral-500 mb-1">Address</p>
        <p className="font-medium text-neutral-800">
          {patient.address1}
        </p>
        {patient.address2 && (
          <p className="font-medium text-neutral-800">
            {patient.address2}
          </p>
        )}
        <p className="font-medium text-neutral-800">
          {patient.city}, {patient.state} {patient.zipCode}
        </p>
      </div>
      
      {patient.emergencyContact && (
        <>
          <h3 className="text-lg font-medium text-neutral-800 pt-4 border-t border-neutral-200">
            Emergency Contact
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Name</p>
              <p className="font-medium text-neutral-800">
                {patient.emergencyContact.name}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Relationship</p>
              <p className="font-medium text-neutral-800">
                {patient.emergencyContact.relationship}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Phone</p>
              <p className="font-medium text-neutral-800">
                {patient.emergencyContact.phone}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export interface PatientProfileProps {
  patient: Patient;
  onUpdate: (patientId: string, data: Partial<PatientRegistrationFormData>) => Promise<Patient>;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onUpdate,
  isLoading = false,
  error,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Convert Patient to form data format
  const patientToFormData = (patient: Patient): PatientRegistrationFormData => {
    return {
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName || '',
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address1: patient.address1,
      address2: patient.address2 || '',
      city: patient.city,
      state: patient.state,
      zipCode: patient.zipCode,
      phone: patient.phone,
      email: patient.email,
      preferredContactMethod: patient.preferredContactMethod,
      emergencyContact: patient.emergencyContact || {
        name: '',
        relationship: '',
        phone: '',
      },
    };
  };
  
  // Handle form submission
  const handleSubmit = async (data: PatientRegistrationFormData) => {
    try {
      await onUpdate(patient.id, data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update patient profile:', err);
    }
  };
  
  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">
        Patient Profile
      </h2>
      
      <Tabs
        tabs={['Profile', 'Medical History', 'Insurance', 'Documents']}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {activeTab === 0 && (
        isEditing ? (
          <PatientRegistrationForm
            initialData={patientToFormData(patient)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        ) : (
          <PatientProfileSummary
            patient={patient}
            onEdit={() => setIsEditing(true)}
          />
        )
      )}
      
      {activeTab === 1 && (
        <div className="py-8 text-center text-neutral-500">
          Medical history information will be implemented in a future sprint.
        </div>
      )}
      
      {activeTab === 2 && (
        <div className="py-8 text-center text-neutral-500">
          Insurance information will be implemented in a future sprint.
        </div>
      )}
      
      {activeTab === 3 && (
        <div className="py-8 text-center text-neutral-500">
          Documents will be implemented in a future sprint.
        </div>
      )}
    </Card>
  );
};