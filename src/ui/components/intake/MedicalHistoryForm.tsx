import React, { useState } from 'react';
import { MedicalHistory } from '@/core/entities/MedicalHistory';
import { Button } from '@/ui/design-system/components/Button';
import { Input } from '@/ui/design-system/components/Input';
import { Select } from '@/ui/design-system/components/Select';
import { Card } from '@/ui/design-system/components/Card';
import { Tabs } from '@/ui/design-system/components/Tabs';

interface MedicalHistoryFormProps {
  data: MedicalHistory;
  onChange: (data: MedicalHistory) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

// Common medical conditions for the checklist
const COMMON_CONDITIONS = [
  'Asthma',
  'Cancer',
  'Diabetes',
  'Heart Disease',
  'Hypertension',
  'Stroke',
  'Arthritis',
  'Depression',
  'Anxiety',
  'Thyroid Disorder',
  'Kidney Disease',
  'Liver Disease',
  'Migraines',
  'Seizures',
  'COPD',
];

// Common family history conditions
const FAMILY_HISTORY_CONDITIONS = [
  'Cancer',
  'Diabetes',
  'Heart Disease',
  'Hypertension',
  'Stroke',
  'Mental Illness',
  'Substance Abuse',
  'Kidney Disease',
  'Thyroid Disorder',
  'Alzheimer\'s/Dementia',
];

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleAllergyChange = (hasAllergies: boolean) => {
    onChange({
      ...data,
      allergies: {
        ...data.allergies,
        hasAllergies,
      },
    });
  };

  const handleAllergyItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...data.allergies.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    onChange({
      ...data,
      allergies: {
        ...data.allergies,
        items: updatedItems,
      },
    });
  };

  const addAllergyItem = () => {
    onChange({
      ...data,
      allergies: {
        ...data.allergies,
        items: [
          ...data.allergies.items,
          { name: '', reaction: '', severity: 'mild' },
        ],
      },
    });
  };

  const removeAllergyItem = (index: number) => {
    const updatedItems = [...data.allergies.items];
    updatedItems.splice(index, 1);

    onChange({
      ...data,
      allergies: {
        ...data.allergies,
        items: updatedItems,
      },
    });
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...data.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };

    onChange({
      ...data,
      medications: updatedMedications,
    });
  };

  const addMedication = () => {
    onChange({
      ...data,
      medications: [
        ...data.medications,
        { name: '', dosage: '', frequency: '', reason: '' },
      ],
    });
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...data.medications];
    updatedMedications.splice(index, 1);

    onChange({
      ...data,
      medications: updatedMedications,
    });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const updatedConditions = checked
      ? [...data.conditions, condition]
      : data.conditions.filter(c => c !== condition);

    onChange({
      ...data,
      conditions: updatedConditions,
    });
  };

  const handleSurgeryChange = (index: number, field: string, value: string) => {
    const updatedSurgeries = [...data.surgeries];
    updatedSurgeries[index] = {
      ...updatedSurgeries[index],
      [field]: value,
    };

    onChange({
      ...data,
      surgeries: updatedSurgeries,
    });
  };

  const addSurgery = () => {
    onChange({
      ...data,
      surgeries: [
        ...data.surgeries,
        { procedure: '', date: '', notes: '' },
      ],
    });
  };

  const removeSurgery = (index: number) => {
    const updatedSurgeries = [...data.surgeries];
    updatedSurgeries.splice(index, 1);

    onChange({
      ...data,
      surgeries: updatedSurgeries,
    });
  };

  const handleFamilyHistoryChange = (condition: string, value: boolean) => {
    onChange({
      ...data,
      familyHistory: {
        ...data.familyHistory,
        [condition]: value,
      },
    });
  };

  const handleSocialHistoryChange = (field: keyof MedicalHistory['socialHistory'], value: any) => {
    onChange({
      ...data,
      socialHistory: {
        ...data.socialHistory,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const tabs = [
    { label: 'Allergies', content: 
      <div className="space-y-4">
        <div className="mb-4">
          <p className="font-medium mb-2">Do you have any allergies?</p>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={data.allergies.hasAllergies ? 'primary' : 'outline'}
              onClick={() => handleAllergyChange(true)}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!data.allergies.hasAllergies ? 'primary' : 'outline'}
              onClick={() => handleAllergyChange(false)}
            >
              No
            </Button>
          </div>
        </div>

        {data.allergies.hasAllergies && (
          <div className="space-y-4">
            {data.allergies.items.map((item, index) => (
              <div key={index} className="border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Allergy #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeAllergyItem(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Allergy Name"
                    value={item.name}
                    onChange={(e) => handleAllergyItemChange(index, 'name', e.target.value)}
                    placeholder="E.g., Penicillin, Peanuts, Latex"
                  />
                  <Input
                    label="Reaction"
                    value={item.reaction}
                    onChange={(e) => handleAllergyItemChange(index, 'reaction', e.target.value)}
                    placeholder="E.g., Rash, Swelling, Anaphylaxis"
                  />
                  <Select
                    label="Severity"
                    value={item.severity}
                    onChange={(e) => handleAllergyItemChange(index, 'severity', e.target.value)}
                    options={[
                      { value: 'mild', label: 'Mild' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'severe', label: 'Severe' },
                    ]}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAllergyItem}>
              Add Another Allergy
            </Button>
          </div>
        )}
      </div>
    },
    { label: 'Medications', content: 
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Current Medications</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please list all medications you are currently taking, including over-the-counter medications, supplements, and vitamins.
        </p>

        {data.medications.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No medications added yet.</p>
            <Button type="button" variant="outline" onClick={addMedication}>
              Add Medication
            </Button>
          </div>
        ) : (
          <>
            {data.medications.map((medication, index) => (
              <div key={index} className="border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Medication #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeMedication(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Medication Name"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    placeholder="E.g., Lisinopril, Metformin"
                  />
                  <Input
                    label="Dosage"
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    placeholder="E.g., 10mg, 500mg"
                  />
                  <Input
                    label="Frequency"
                    value={medication.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    placeholder="E.g., Once daily, Twice daily"
                  />
                  <Input
                    label="Reason"
                    value={medication.reason}
                    onChange={(e) => handleMedicationChange(index, 'reason', e.target.value)}
                    placeholder="E.g., Hypertension, Diabetes"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMedication}>
              Add Another Medication
            </Button>
          </>
        )}
      </div>
    },
    { label: 'Medical Conditions', content: 
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Medical Conditions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please select any medical conditions you have been diagnosed with.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
          {COMMON_CONDITIONS.map((condition) => (
            <div key={condition} className="flex items-center">
              <input
                type="checkbox"
                id={`condition-${condition}`}
                checked={data.conditions.includes(condition)}
                onChange={(e) => handleConditionChange(condition, e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`condition-${condition}`}>{condition}</label>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="font-medium mb-2">Other conditions not listed above:</p>
          <Input
            type="text"
            placeholder="Enter other conditions, separated by commas"
            value={data.conditions.filter(c => !COMMON_CONDITIONS.includes(c)).join(', ')}
            onChange={(e) => {
              const otherConditions = e.target.value
                .split(',')
                .map(c => c.trim())
                .filter(c => c !== '');
              
              const standardConditions = data.conditions.filter(c => COMMON_CONDITIONS.includes(c));
              onChange({
                ...data,
                conditions: [...standardConditions, ...otherConditions]
              });
            }}
          />
        </div>
      </div>
    },
    { label: 'Surgeries', content: 
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Surgical History</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please list any surgeries or procedures you have had.
        </p>

        {data.surgeries.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No surgeries added yet.</p>
            <Button type="button" variant="outline" onClick={addSurgery}>
              Add Surgery
            </Button>
          </div>
        ) : (
          <>
            {data.surgeries.map((surgery, index) => (
              <div key={index} className="border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Surgery #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeSurgery(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Procedure"
                    value={surgery.procedure}
                    onChange={(e) => handleSurgeryChange(index, 'procedure', e.target.value)}
                    placeholder="E.g., Appendectomy, Knee Replacement"
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={surgery.date}
                    onChange={(e) => handleSurgeryChange(index, 'date', e.target.value)}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Notes (optional)"
                      value={surgery.notes || ''}
                      onChange={(e) => handleSurgeryChange(index, 'notes', e.target.value)}
                      placeholder="Any additional details"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSurgery}>
              Add Another Surgery
            </Button>
          </>
        )}
      </div>
    },
    { label: 'Family & Social', content: 
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Family History</h3>
          <p className="text-sm text-gray-600 mb-4">
            Has anyone in your immediate family (parents, siblings, children) been diagnosed with any of the following conditions?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {FAMILY_HISTORY_CONDITIONS.map((condition) => (
              <div key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  id={`family-${condition}`}
                  checked={!!data.familyHistory[condition]}
                  onChange={(e) => handleFamilyHistoryChange(condition, e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`family-${condition}`}>{condition}</label>
              </div>
            ))}
          </div>
        </div>
        
        <hr className="my-6" />
        
        <div>
          <h3 className="font-semibold text-lg mb-3">Social History</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium mb-2">Smoking Status</p>
              <Select
                value={data.socialHistory.smokingStatus}
                onChange={(e) => handleSocialHistoryChange('smokingStatus', e.target.value)}
                options={[
                  { value: 'never', label: 'Never smoked' },
                  { value: 'former', label: 'Former smoker' },
                  { value: 'current', label: 'Current smoker' },
                ]}
              />
            </div>

            <div>
              <p className="font-medium mb-2">Alcohol Use</p>
              <Select
                value={data.socialHistory.alcoholUse}
                onChange={(e) => handleSocialHistoryChange('alcoholUse', e.target.value)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'occasional', label: 'Occasional' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'heavy', label: 'Heavy' },
                ]}
              />
            </div>

            <div>
              <p className="font-medium mb-2">Exercise Frequency</p>
              <Select
                value={data.socialHistory.exerciseFrequency}
                onChange={(e) => handleSocialHistoryChange('exerciseFrequency', e.target.value)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'occasional', label: 'Occasional' },
                  { value: 'regular', label: 'Regular (1-3 times/week)' },
                  { value: 'daily', label: 'Daily' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Medical History</h2>
      <p className="text-sm text-gray-600 mb-6">
        Please provide information about your medical history. This helps us provide you with the best care possible.
        All information is kept confidential and protected by HIPAA regulations.
      </p>

      <form onSubmit={handleSubmit}>
        <Tabs
          tabs={tabs.map(tab => tab.label)}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {tabs[activeTab].content}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            type="button"
          >
            Back
          </Button>
          
          <div className="flex space-x-3">
            {activeTab < tabs.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setActiveTab(activeTab + 1)}
                type="button"
              >
                Next Section
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};