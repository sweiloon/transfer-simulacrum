/**
 * Security utilities for input validation and sanitization
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasNonalphas) {
    return { 
      isValid: false, 
      message: 'Password must contain uppercase, lowercase, number, and special character' 
    };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

export const sanitizeName = (name: string): string => {
  const sanitized = name.trim().replace(/[<>\"'&]/g, '');
  return sanitized.substring(0, 50); // Limit name length
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Rate limiting for login attempts (client-side basic protection)
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const attempt = loginAttempts.get(email);
  
  if (!attempt) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset counter after 15 minutes
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Allow max 5 attempts per 15 minutes
  if (attempt.count >= 5) {
    return false;
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  return true;
};

/**
 * Clear sensitive data from memory
 */
export const clearSensitiveData = (obj: any): void => {
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = '';
      } else if (typeof obj[key] === 'object') {
        clearSensitiveData(obj[key]);
      }
    });
  }
};