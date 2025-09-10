/**
 * Data sanitization utilities to prevent XSS and injection attacks
 */

export const sanitizeHtml = (str: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return str.replace(/[&<>"'/]/g, (s) => map[s]);
};

export const sanitizeTransferData = (data: any): any => {
  const sanitized = { ...data };
  
  // Sanitize string fields
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeHtml(sanitized[key].trim());
    }
  });
  
  return sanitized;
};

export const validateTransferAmount = (amount: string): { isValid: boolean; message?: string } => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Invalid amount format' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, message: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 1000000) {
    return { isValid: false, message: 'Amount exceeds maximum limit' };
  }
  
  // Check for reasonable decimal places (max 2)
  const decimalPlaces = (amount.split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, message: 'Maximum 2 decimal places allowed' };
  }
  
  return { isValid: true };
};