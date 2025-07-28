import '@testing-library/jest-dom';

// Mock fetch globally with proper Response object
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve([
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
      { id: '3', label: 'Option 3' },
    ]),
  } as Response)
);

// Mock react-bootstrap-typeahead
jest.mock('react-bootstrap-typeahead', () => {
  const React = require('react');
  return {
    Typeahead: ({ onChange, onInputChange, ...props }: any) => {
      return React.createElement('input', {
        ...props,
        onChange: (e: any) => {
          if (onChange) onChange([{ id: '1', label: e.target.value }]);
          if (onInputChange) onInputChange(e.target.value);
        },
        'data-testid': 'typeahead-input',
      });
    },
  };
}); 