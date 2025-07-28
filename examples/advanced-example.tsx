import React, { useState } from 'react';
import { MultiSelectorDropdown, Option } from '../src';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const AdvancedExample: React.FC = () => {
  const [selectedSectors, setSelectedSectors] = useState<Option[]>([]);
  const [error, setError] = useState('');

  const handleAddNewSector = async (value: string): Promise<Option | null> => {
    try {
      const response = await fetch('/api/sectors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token'
        },
        body: JSON.stringify({ 
          label: value,
          category: 'user-generated',
          createdAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        const newSector = await response.json();
        return newSector;
      } else {
        throw new Error('Failed to add new sector');
      }
    } catch (error) {
      console.error('Error adding new sector:', error);
      setError('Failed to add new sector. Please try again.');
      return null;
    }
  };

  const handleSearch = (searchTerm: string) => {
    console.log('Searching for sectors:', searchTerm);
    setError(''); // Clear any previous errors
  };

  const handleChange = (options: Option[]) => {
    setSelectedSectors(options);
    setError(''); // Clear any previous errors
    
    // Validate selections
    if (options.length > 10) {
      setError('Maximum 10 sectors allowed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Advanced Multi-Selector Dropdown Example</h2>
      <p className="text-muted">This example demonstrates advanced features like error handling, validation, and custom styling.</p>
      
      <div className="row">
        <div className="col-md-8">
          <MultiSelectorDropdown
            apiUrl="/api/sectors"
            apiMethod="GET"
            apiHeaders={{
              'Authorization': 'Bearer your-token',
              'Accept': 'application/json'
            }}
            apiParams={{
              limit: 50,
              sort: 'label',
              active: true
            }}
            placeholder="Choose interested sectors..."
            label="Interested Sectors"
            required={true}
            searchEnabled={true}
            searchPlaceholder="Search sectors..."
            minSearchLength={2}
            allowAddNew={true}
            addNewPrefix="Add new sector: "
            onAddNew={handleAddNewSector}
            onSearch={handleSearch}
            multiple={true}
            maxSelections={10}
            onChange={handleChange}
            value={selectedSectors}
            clearButton={true}
            size="md"
            error={error}
            touched={!!error}
            className="custom-dropdown"
          />
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Selected Sectors</h5>
            </div>
            <div className="card-body">
              {selectedSectors.length === 0 ? (
                <p className="text-muted">No sectors selected</p>
              ) : (
                <ul className="list-unstyled">
                  {selectedSectors.map((sector) => (
                    <li key={sector.id} className="mb-1">
                      <span className="badge bg-primary">{sector.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4>Configuration Details:</h4>
        <ul>
          <li><strong>API Integration:</strong> Fetches sectors from <code>/api/sectors</code></li>
          <li><strong>Search:</strong> Minimum 2 characters to trigger search</li>
          <li><strong>Add New:</strong> Allows adding new sectors with custom prefix</li>
          <li><strong>Validation:</strong> Maximum 10 selections with error handling</li>
          <li><strong>Styling:</strong> Bootstrap classes with custom CSS support</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedExample; 