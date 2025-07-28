import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Option, MultiSelectorDropdownProps } from './types';

const MultiSelectorDropdown: React.FC<MultiSelectorDropdownProps> = ({
  apiUrl,
  apiMethod = 'GET',
  apiHeaders = {},
  apiParams = {},
  placeholder = 'Select options...',
  label,
  required = false,
  disabled = false,
  className = '',
  searchEnabled = true,
  searchPlaceholder,
  minSearchLength = 0,
  allowAddNew = true,
  addNewPrefix = 'Add new: ',
  onAddNew,
  multiple = true,
  maxSelections,
  onChange,
  onSearch,
  onBlur,
  onFocus,
  value = [],
  defaultValue = [],
  clearButton = true,
  size = 'md',
  error,
  touched = false,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(value.length > 0 ? value : defaultValue);
  const [newOptionLabel, setNewOptionLabel] = useState('');

  // Fetch options from API
  const fetchOptions = useCallback(async (search?: string) => {
    if (!apiUrl) return;

    setLoading(true);
    try {
      // Handle relative URLs by prepending window.location.origin
      let fullUrl = apiUrl;
      if (!apiUrl.startsWith('http')) {
        // In test environment, use a mock URL
        if (typeof window === 'undefined' || !window.location) {
          fullUrl = `https://example.com${apiUrl}`;
        } else {
          fullUrl = `${window.location.origin}${apiUrl}`;
        }
      }
      
      const url = new URL(fullUrl);
      
      // Add search parameter if provided
      if (search && search.length >= minSearchLength) {
        url.searchParams.append('search', search);
      }

      // Add additional API parameters
      Object.entries(apiParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });

      const response = await fetch(url.toString(), {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          ...apiHeaders,
        },
        ...(apiMethod === 'POST' && { body: JSON.stringify(apiParams) }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const fetchedOptions = Array.isArray(data) ? data : data.data || [];
      
      setOptions(fetchedOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, apiMethod, apiHeaders, apiParams, minSearchLength]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Filter out already selected options
  const filteredOptions = useMemo(() => {
    const selectedIds = selectedOptions.map(option => option.id);
    return options.filter(option => !selectedIds.includes(option.id));
  }, [options, selectedOptions]);

  // Handle search input change
  const handleInputChange = useCallback((text: string) => {
    setSearchTerm(text);
    setNewOptionLabel(text);
    
    if (onSearch) {
      onSearch(text);
    }

    // Debounce API call for search
    const timeoutId = setTimeout(() => {
      if (text.length >= minSearchLength) {
        fetchOptions(text);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onSearch, minSearchLength, fetchOptions]);

  // Handle adding new option
  const handleAddNew = useCallback(async () => {
    if (!allowAddNew || !newOptionLabel.trim() || !onAddNew) return;

    try {
      const newOption = await onAddNew(newOptionLabel.trim());
      if (newOption) {
        setOptions(prev => [...prev, newOption]);
        setSelectedOptions(prev => [...prev, newOption]);
        setNewOptionLabel('');
        setSearchTerm('');
        
        if (onChange) {
          onChange([...selectedOptions, newOption]);
        }
      }
    } catch (error) {
      console.error('Error adding new option:', error);
    }
  }, [allowAddNew, newOptionLabel, onAddNew, selectedOptions, onChange]);

  // Handle key down for adding new option
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newOptionLabel.trim() && allowAddNew) {
      event.preventDefault();
      handleAddNew();
    }
  }, [newOptionLabel, allowAddNew, handleAddNew]);

  // Handle selection change
  const handleSelectionChange = useCallback((selected: any[]) => {
    const newSelections: Option[] = [];

    for (const item of selected) {
      if (typeof item === 'string' || (item as any)?.customOption) {
        // This is a new option to be added
        const label = typeof item === 'string' ? item : (item as any).label;
        setNewOptionLabel(label);
        handleAddNew();
      } else {
        // This is an existing option
        newSelections.push(item as Option);
      }
    }

    // Check max selections limit
    if (maxSelections && newSelections.length > maxSelections) {
      return;
    }

    setSelectedOptions(newSelections);
    setSearchTerm('');
    
    if (onChange) {
      onChange(newSelections);
    }
  }, [maxSelections, onChange, handleAddNew]);

  // Remove selected option
  const removeOption = useCallback((optionToRemove: Option) => {
    const updatedSelections = selectedOptions.filter(option => option.id !== optionToRemove.id);
    setSelectedOptions(updatedSelections);
    
    if (onChange) {
      onChange(updatedSelections);
    }
  }, [selectedOptions, onChange]);

  // Update selected options when value prop changes
  useEffect(() => {
    if (value && value.length > 0) {
      setSelectedOptions(value);
    }
  }, [value]);

  const sizeClass = {
    sm: 'form-control-sm',
    md: '',
    lg: 'form-control-lg',
  }[size];

  return (
    <div className={`multi-selector-dropdown ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className="input-group">
        <Typeahead
          id="multi-selector-dropdown"
          options={filteredOptions}
          allowNew={allowAddNew}
          newSelectionPrefix={addNewPrefix}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onChange={handleSelectionChange}
          placeholder={placeholder}
          selected={[]}
          clearButton={clearButton}
          labelKey="label"
          multiple={multiple}
          disabled={disabled}
          isLoading={loading}
          minLength={minSearchLength}
          className={`form-control ${sizeClass}`}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        
        {allowAddNew && newOptionLabel.trim() && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleAddNew}
            disabled={disabled}
          >
            <i className="fa fa-plus"></i>
          </button>
        )}
      </div>

      {touched && error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}

      {/* Display selected options */}
      {selectedOptions.length > 0 && (
        <div className="mt-2">
          <div className="d-flex gap-2 flex-wrap">
            {selectedOptions.map((option) => (
              <div
                key={option.id}
                className="d-flex align-items-center gap-2 position-relative"
              >
                <span className="btn btn-outline checkbox-pill rounded-pill bg-primary text-white border-primary">
                  <span className="fw-bold">
                    {option.label}
                  </span>
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-color-white p-0"
                    style={{
                      width: '24px',
                      height: '24px'
                    }}
                    onClick={() => removeOption(option)}
                    disabled={disabled}
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectorDropdown; 