import React, { useState } from 'react';
import { MultiSelectorDropdown, Option } from '../src';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const BasicExample: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleAddNew = async (value: string): Promise<Option | null> => {
    try {
      // Simulate API call to add new option
      const response = await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: value }),
      });
      
      if (response.ok) {
        const newOption = await response.json();
        return newOption;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding new option:', error);
      return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Basic Multi-Selector Dropdown Example</h2>
      
      <MultiSelectorDropdown
        apiUrl="/api/options"
        placeholder="Select options..."
        label="Choose Options"
        onChange={setSelectedOptions}
        onAddNew={handleAddNew}
        allowAddNew={true}
        multiple={true}
      />
      
      <div className="mt-3">
        <h4>Selected Options:</h4>
        <pre>{JSON.stringify(selectedOptions, null, 2)}</pre>
      </div>
    </div>
  );
};

export default BasicExample; 