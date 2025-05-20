'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Select,
  Modal,
  Tabs,
  Calendar,
  DatePicker,
  ToastProvider,
  useToast,
  useToastHelpers,
} from '@/ui/design-system/components';

const ToastDemo = () => {
  const { addToast } = useToast();
  const { success, error, warning, info } = useToastHelpers();

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => success('Success message')}
          variant="primary"
          size="small"
        >
          Success Toast
        </Button>
        <Button 
          onClick={() => error('Error message')}
          variant="primary"
          size="small"
        >
          Error Toast
        </Button>
        <Button 
          onClick={() => warning('Warning message')}
          variant="primary"
          size="small"
        >
          Warning Toast
        </Button>
        <Button 
          onClick={() => info('Info message')}
          variant="primary"
          size="small"
        >
          Info Toast
        </Button>
        <Button 
          onClick={() => addToast({
            title: 'Custom Toast',
            message: 'This is a custom toast message',
            type: 'info',
            duration: 5000,
          })}
          variant="primary"
          size="small"
        >
          Custom Toast
        </Button>
      </div>
    </div>
  );
};

export default function ComponentsShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const tabItems = [
    {
      id: 'buttons',
      label: 'Buttons',
      content: (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
          </div>

          <h3 className="text-lg font-medium">Button Sizes</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="small">Small</Button>
            <Button variant="primary" size="medium">Medium</Button>
            <Button variant="primary" size="large">Large</Button>
          </div>

          <h3 className="text-lg font-medium">Button States</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" leftIcon={<span>👈</span>}>Left Icon</Button>
            <Button variant="primary" rightIcon={<span>👉</span>}>Right Icon</Button>
          </div>
        </div>
      ),
    },
    {
      id: 'inputs',
      label: 'Inputs',
      content: (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Input Variants</h3>
          <div className="space-y-4 max-w-md">
            <Input label="Standard Input" placeholder="Enter text here" />
            <Input 
              label="Input with Helper Text" 
              placeholder="Enter text here" 
              helperText="This is helper text" 
            />
            <Input 
              label="Input with Error" 
              placeholder="Enter text here" 
              error 
              errorMessage="This field is required" 
            />
            <Input 
              label="Disabled Input" 
              placeholder="Enter text here" 
              disabled 
            />
            <Input 
              label="Input with Left Icon" 
              placeholder="Search..." 
              leftIcon={
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              } 
            />
          </div>

          <h3 className="text-lg font-medium">Select Input</h3>
          <div className="space-y-4 max-w-md">
            <Select 
              label="Standard Select" 
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
              placeholder="Select an option"
            />
            <Select 
              label="Disabled Select" 
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2', disabled: true },
                { value: 'option3', label: 'Option 3' },
              ]}
              placeholder="Select an option"
              disabled
            />
          </div>
        </div>
      ),
    },
    {
      id: 'datepickers',
      label: 'Date Pickers',
      content: (
        <div className="p-4 space-y-6">
          <h3 className="text-lg font-medium">Calendar</h3>
          <div className="max-w-xs">
            <Calendar 
              value={selectedDate}
              onChange={setSelectedDate}
              highlightedDates={[new Date(2023, 5, 15), new Date(2023, 5, 22)]}
            />
          </div>

          <h3 className="text-lg font-medium">Date Picker</h3>
          <div className="max-w-md">
            <DatePicker 
              label="Select Date"
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="MM/DD/YYYY"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'cards',
      label: 'Cards',
      content: (
        <div className="p-4 space-y-6">
          <h3 className="text-lg font-medium">Card Variants</h3>
          <div className="space-y-4 max-w-md">
            <Card>
              <p>Basic card without title</p>
            </Card>
            
            <Card title="Card with Title">
              <p>This card has a title</p>
            </Card>
            
            <Card 
              title="Card with Footer" 
              footer={
                <div className="flex justify-end">
                  <Button variant="primary" size="small">Action</Button>
                </div>
              }
            >
              <p>This card has a title and footer</p>
            </Card>
            
            <Card 
              title="Hoverable Card"
              hoverable
            >
              <p>This card has hover effects</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'modals',
      label: 'Modals',
      content: (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Modal Example</h3>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Modal Title"
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm</Button>
              </div>
            }
          >
            <p className="mb-4">This is the modal content. You can add any components here.</p>
            <Input label="Sample Input" placeholder="Enter something" />
          </Modal>
        </div>
      ),
    },
    {
      id: 'toasts',
      label: 'Toasts',
      content: (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Toast Examples</h3>
          <ToastDemo />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Premier Healthcare Component Library</h1>
      <p className="text-neutral-600 mb-8">
        Explore the design system components available for building the Premier Healthcare Platform.
      </p>

      <Card className="mb-8">
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
}