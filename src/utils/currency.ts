/**
 * Currency formatting utilities for Malaysian Ringgit (RM)
 */

/**
 * Formats a number or string to Malaysian currency format (RM X,XXX.XX)
 * @param value - The value to format (number or string)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string): string => {
  if (!value && value !== 0) return 'RM0.00';
  
  // Convert to number if string
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  
  // Handle invalid numbers
  if (isNaN(numValue)) return 'RM0.00';
  
  // Format with commas and 2 decimal places
  return `RM${numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Formats currency input in real-time as user types
 * @param value - Current input value
 * @returns Formatted currency string for input display
 */
export const formatCurrencyInput = (value: string): string => {
  // Remove all non-digit characters except decimal point
  let cleanValue = value.replace(/[^\d.]/g, '');
  
  // Handle multiple decimal points - keep only the first one
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    cleanValue = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // If empty, return empty string for input
  if (!cleanValue) return '';
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = cleanValue.split('.');
  
  // Format integer part with commas
  const formattedInteger = parseInt(integerPart || '0').toLocaleString('en-US');
  
  // Construct the result
  let result = `RM${formattedInteger}`;
  
  // Add decimal part if it exists, limit to 2 digits
  if (decimalPart !== undefined) {
    result += `.${decimalPart.slice(0, 2)}`;
  }
  
  return result;
};

/**
 * Parses formatted currency string back to number
 * @param formattedValue - Formatted currency string (e.g., "RM1,234.56")
 * @returns Numeric value
 */
export const parseCurrency = (formattedValue: string): number => {
  // Remove RM prefix and commas
  const cleanValue = formattedValue.replace(/[^\d.-]/g, '');
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Validates if a currency amount is valid
 * @param value - Value to validate
 * @returns Boolean indicating if value is valid
 */
export const isValidCurrencyAmount = (value: string | number): boolean => {
  const numValue = typeof value === 'string' ? parseCurrency(value) : value;
  return !isNaN(numValue) && numValue >= 0;
};

// Re-export React for the custom hook
import * as React from 'react';

/**
 * Custom hook for currency input handling
 * @param initialValue - Initial currency value
 * @returns Object with formatted value and handler function
 */
export const useCurrencyInput = (initialValue: string | number = '') => {
  const [displayValue, setDisplayValue] = React.useState(() => {
    if (initialValue) {
      return formatCurrency(initialValue);
    }
    return '';
  });

  const handleChange = (newValue: string) => {
    const formatted = formatCurrencyInput(newValue);
    setDisplayValue(formatted);
  };

  const getValue = (): number => {
    return parseCurrency(displayValue);
  };

  const setValue = (value: string | number) => {
    setDisplayValue(value ? formatCurrency(value) : '');
  };

  return {
    displayValue,
    handleChange,
    getValue,
    setValue
  };
};