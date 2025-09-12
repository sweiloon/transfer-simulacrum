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
  // First sanitize the input
  const cleanAmount = amount.trim();
  
  if (!cleanAmount) {
    return { isValid: false, message: 'Amount is required' };
  }
  
  const numAmount = parseFloat(cleanAmount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Invalid amount format' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, message: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 1000000) {
    return { isValid: false, message: 'Amount exceeds maximum limit (RM 1,000,000)' };
  }
  
  if (numAmount < 0.01) {
    return { isValid: false, message: 'Minimum amount is RM 0.01' };
  }
  
  // Check for reasonable decimal places (max 2)
  const decimalPlaces = (cleanAmount.split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, message: 'Maximum 2 decimal places allowed' };
  }
  
  return { isValid: true };
};

export const validateAccountNumber = (accountNumber: string): { isValid: boolean; message?: string } => {
  const cleanAccount = accountNumber.trim().replace(/\s+/g, '');
  
  if (!cleanAccount) {
    return { isValid: false, message: 'Account number is required' };
  }
  
  if (cleanAccount.length < 8 || cleanAccount.length > 20) {
    return { isValid: false, message: 'Account number must be between 8-20 digits' };
  }
  
  if (!/^\d+$/.test(cleanAccount)) {
    return { isValid: false, message: 'Account number must contain only numbers' };
  }
  
  return { isValid: true };
};

export const validateRecipientName = (name: string): { isValid: boolean; message?: string } => {
  const cleanName = name.trim();
  
  if (!cleanName) {
    return { isValid: false, message: 'Recipient name is required' };
  }
  
  if (cleanName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (cleanName.length > 100) {
    return { isValid: false, message: 'Name must be less than 100 characters' };
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and common symbols
  if (!/^[a-zA-Z\s\-'./()]+$/.test(cleanName)) {
    return { isValid: false, message: 'Name contains invalid characters' };
  }
  
  return { isValid: true };
};

export const validateReference = (reference: string): { isValid: boolean; message?: string } => {
  const cleanRef = reference.trim();
  
  if (cleanRef.length > 50) {
    return { isValid: false, message: 'Reference must be less than 50 characters' };
  }
  
  // Allow alphanumeric, spaces, and common symbols
  if (cleanRef && !/^[a-zA-Z0-9\s\-_.,()]+$/.test(cleanRef)) {
    return { isValid: false, message: 'Reference contains invalid characters' };
  }
  
  return { isValid: true };
};