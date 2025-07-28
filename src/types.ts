// types.ts

export interface Option {
  id: string | number;
  label: string;
  [key: string]: any;
}

export interface MultiSelectorDropdownProps {
  // Data Source (updated)
  options?: Option[];            // ← NEW
  apiUrl?: string;               // ← Made optional
  apiMethod?: 'GET' | 'POST';
  apiHeaders?: Record<string, string>;
  apiParams?: Record<string, any>;

  // Component Configuration
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;

  // Search Configuration
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  minSearchLength?: number;

  // Add New Option Configuration
  allowAddNew?: boolean;
  addNewPrefix?: string;
  onAddNew?: (value: string) => Promise<Option | null>;

  // Multi-selection Configuration
  multiple?: boolean;
  maxSelections?: number;

  // Callbacks
  onChange?: (selectedOptions: Option[]) => void;
  onSearch?: (searchTerm: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  // Value Management
  value?: Option[];
  defaultValue?: Option[];

  // Styling
  clearButton?: boolean;
  size?: 'sm' | 'md' | 'lg';

  // Error Handling
  error?: string;
  touched?: boolean;
}

export interface ApiResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: any;
}
