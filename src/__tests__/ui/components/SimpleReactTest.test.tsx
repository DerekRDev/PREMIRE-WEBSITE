import React from 'react';
import { render, screen } from '@testing-library/react';

// A simple test component
const TestComponent = () => {
  return <div>Test Component</div>;
};

describe('Simple React Component Test', () => {
  it('renders without errors', () => {
    render(<TestComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});