# Multi-Selector Dropdown

A powerful React component for multi-select dropdown with API-driven options, search capability, and add new option functionality. Built with TypeScript and designed for modern React applications.

![Multi-Selector Dropdown](multi-selector-dropdown.png)

*The component in action - showing selected options with visual tags and JSON output*

## ✨ Features

- **🚀 API-Driven Options**: Fetch options dynamically from external APIs
- **🔍 Search Capability**: Real-time search and filtering of options
- **➕ Add New Option**: Add new values to the database if not found
- **📋 Multi-Selection Support**: Select multiple options simultaneously
- **⚡ TypeScript Support**: Full TypeScript support with type definitions
- **🎨 Customizable**: Highly configurable with various props and callbacks
- **♿ Accessible**: Built with accessibility in mind
- **🛡️ Error Handling**: Comprehensive error handling for API failures
- **📱 Responsive**: Works seamlessly across different screen sizes

## 📦 Installation

```bash
npm install multi-selector-dropdown
```

## 🔧 Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom react-bootstrap-typeahead
```

### CSS Import

You'll also need to import the required CSS in your application:

```javascript
import 'react-bootstrap-typeahead/css/Typeahead.css';
```

## 🚀 Basic Usage

A simple example showing the basic functionality of the component:

```tsx
import React, { useState, useEffect } from 'react';
import { MultiSelectorDropdown } from 'multi-selector-dropdown'; // Custom component
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import 'react-bootstrap-typeahead/css/Typeahead.css';
// import './App.css';

function App() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  const dummyData = [
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
    { id: 4, label: 'Date' },
    { id: 5, label: 'Elderberry' },
  ];

  useEffect(() => {
    setTimeout(() => {
      setOptions(dummyData);
    }, 500);
  }, []);

  const handleAddNew = async (value) => {
    const newOption = {
      id: options.length + 1,
      label: value,
    };
    setOptions((prev) => [...prev, newOption]);
    return newOption;
  };

  return (
    <div className="container m-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-16">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Multi-Selector Dropdown</h2>

              <MultiSelectorDropdown
                options={options}
                placeholder="Select options..."
                label="Choose Options"
                onChange={setSelectedOptions}
                onAddNew={handleAddNew}
                allowAddNew={true}
                multiple={true}
              />

              <div className="mt-4">
                <h5>Selected Options:</h5>
                <pre className="bg-light p-3 border rounded">
                  {JSON.stringify(selectedOptions, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

## 🎯 Advanced Usage

A comprehensive example demonstrating advanced features like error handling, validation, custom styling, and complex API integration:

```tsx
import React, { useState } from 'react';
import { MultiSelectorDropdown, Option } from 'multi-selector-dropdown';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const AdvancedExample = () => {
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
      <p className="text-muted">
        This example demonstrates advanced features like error handling, validation, 
        custom styling, and complex API integration.
      </p>
      
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
          <li><strong>Error Handling:</strong> Comprehensive error management</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedExample;
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | - | **Required**. The URL to fetch options from |
| `apiMethod` | `'GET' \| 'POST'` | `'GET'` | HTTP method for API requests |
| `apiHeaders` | `Record<string, string>` | `{}` | Additional headers for API requests |
| `apiParams` | `Record<string, any>` | `{}` | Additional parameters for API requests |
| `placeholder` | `string` | `'Select options...'` | Placeholder text for the input |
| `label` | `string` | - | Label for the dropdown |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the dropdown is disabled |
| `className` | `string` | `''` | Additional CSS classes |
| `searchEnabled` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | - | Placeholder for search input |
| `minSearchLength` | `number` | `0` | Minimum characters before triggering search |
| `allowAddNew` | `boolean` | `true` | Allow adding new options |
| `addNewPrefix` | `string` | `'Add new: '` | Prefix for new option suggestions |
| `onAddNew` | `(value: string) => Promise<Option \| null>` | - | Callback for adding new options |
| `multiple` | `boolean` | `true` | Enable multi-selection |
| `maxSelections` | `number` | - | Maximum number of selections allowed |
| `onChange` | `(selectedOptions: Option[]) => void` | - | Callback when selection changes |
| `onSearch` | `(searchTerm: string) => void` | - | Callback when search term changes |
| `onBlur` | `() => void` | - | Callback when input loses focus |
| `onFocus` | `() => void` | - | Callback when input gains focus |
| `value` | `Option[]` | `[]` | Controlled value |
| `defaultValue` | `Option[]` | `[]` | Default value |
| `clearButton` | `boolean` | `true` | Show clear button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the dropdown |
| `error` | `string` | - | Error message to display |
| `touched` | `boolean` | `false` | Whether the field has been touched |

### Types

#### Option
```typescript
interface Option {
  id: string | number;
  label: string;
  [key: string]: any;
}
```

#### ApiResponse
```typescript
interface ApiResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: any;
}
```

## API Response Format

The component expects the API to return data in one of these formats:

### Array Format
```json
[
  { "id": 1, "label": "Option 1" },
  { "id": 2, "label": "Option 2" }
]
```

### Object Format
```json
{
  "data": [
    { "id": 1, "label": "Option 1" },
    { "id": 2, "label": "Option 2" }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}
```

## Styling

The component uses Bootstrap classes by default. You can customize the styling by:

1. Overriding CSS classes
2. Using the `className` prop
3. Customizing the Bootstrap theme

### Custom CSS Example

```css
.multi-selector-dropdown .rbt-input-main {
  border-radius: 0.375rem;
}

.multi-selector-dropdown .btn-outline {
  border-radius: 50px;
}

.multi-selector-dropdown .checkbox-pill {
  background-color: #007bff;
  border-color: #007bff;
}
```

## Error Handling

The component includes built-in error handling for:

- API request failures
- Network errors
- Invalid responses
- Add new option failures

Errors are logged to the console and can be handled through the `onAddNew` callback.

## Accessibility

The component is built with accessibility in mind:

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For support, please open an issue on GitHub or contact the maintainers.

## 👨‍💻 Author

**Akshay Bhalala** 

### 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔑 Keywords

- `react`
- `dropdown`
- `multi-select`
- `typeahead`
- `search`
- `api`
- `typescript`
- `bootstrap`
- `form-control`
- `autocomplete`
- `select`
- `input`
- `ui-component`
- `react-component`
- `javascript`
- `frontend`
- `web-development`
- `user-interface`
- `interactive`
- `responsive` 