import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MultiSelectorDropdown from '../MultiSelectorDropdown';

describe('MultiSelectorDropdown', () => {
  const defaultProps = {
    apiUrl: 'https://api.example.com/options',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<MultiSelectorDropdown {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<MultiSelectorDropdown {...defaultProps} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(<MultiSelectorDropdown {...defaultProps} label="Test Label" required={true} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error is provided', () => {
    render(
      <MultiSelectorDropdown 
        {...defaultProps} 
        error="This field is required" 
        touched={true} 
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const onChange = jest.fn();
    render(<MultiSelectorDropdown {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Option 1' } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('calls onSearch when search term changes', async () => {
    const onSearch = jest.fn();
    render(<MultiSelectorDropdown {...defaultProps} onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('test');
    });
  });

  it('disables component when disabled prop is true', () => {
    render(<MultiSelectorDropdown {...defaultProps} disabled={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MultiSelectorDropdown {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 