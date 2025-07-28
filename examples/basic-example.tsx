import React, { useState } from 'react';
import MultiSelectorDropdown from '../src/MultiSelectorDropdown';
import { Option } from '../src/types';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const BasicExample: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  // Mock API function to simulate adding new options
  const handleAddNew = async (value: string): Promise<Option | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return the new option
    return {
      id: `new-${Date.now()}`,
      label: value,
    };
  };

  const handleChange = (options: Option[]) => {
    setSelectedOptions(options);
    console.log('Selected options:', options);
  };

  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
  };

  return (
    <div className="container mt-5">
      <h2>Multi-Selector Dropdown - Basic Example</h2>
      <p className="text-muted">
        This example demonstrates the basic functionality of the MultiSelectorDropdown component.
        Click on the input field to see the dropdown options appear.
      </p>
      
      <div className="row">
        <div className="col-md-6">
          <MultiSelectorDropdown
            apiUrl="https://jsonplaceholder.typicode.com/users"
            placeholder="Search and select users..."
            label="Select Users"
            required={true}
            allowAddNew={true}
            addNewPrefix="Add new user: "
            onAddNew={handleAddNew}
            onChange={handleChange}
            onSearch={handleSearch}
            multiple={true}
            maxSelections={5}
            clearButton={true}
            size="md"
            error=""
            touched={false}
          />
        </div>
      </div>

      {selectedOptions.length > 0 && (
        <div className="mt-4">
          <h4>Selected Options:</h4>
          <ul className="list-group">
            {selectedOptions.map((option) => (
              <li key={option.id} className="list-group-item">
                <strong>ID:</strong> {option.id} | <strong>Name:</strong> {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BasicExample; 