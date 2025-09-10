/**
 * Security configuration and constants
 */

export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SPECIAL_CHARS: '@$!%*?&',
  },
  
  // Rate limiting
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    WINDOW_MINUTES: 15,
    TRANSFER_ATTEMPTS: 10,
    TRANSFER_WINDOW_MINUTES: 60,
  },
  
  // Data validation
  VALIDATION: {
    MAX_NAME_LENGTH: 50,
    MAX_TRANSFER_AMOUNT: 1000000,
    MAX_DECIMAL_PLACES: 2,
    ALLOWED_CURRENCIES: ['USD', 'EUR', 'GBP', 'SGD', 'MYR'],
  },
  
  // Security headers
  HEADERS: {
    CSP: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vbmmeaddhdefxfgtigzv.supabase.co wss://vbmmeaddhdefxfgtigzv.supabase.co; media-src 'self'; object-src 'none'; frame-src 'none';",
    XFRAME: 'DENY',
    XCONTENT: 'nosniff',
    XSS: '1; mode=block',
    REFERRER: 'strict-origin-when-cross-origin',
  },
  
  // Session management
  SESSION: {
    TIMEOUT_MINUTES: 60,
    REFRESH_THRESHOLD_MINUTES: 10,
  },
} as const;

/**
 * Validate input against security requirements
 */
export const validateSecureInput = (input: string, type: 'email' | 'name' | 'password' | 'amount'): { isValid: boolean; message?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, message: 'Input is required' };
  }

  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.trim())) {
        return { isValid: false, message: 'Invalid email format' };
      }
      break;
      
    case 'name':
      if (input.trim().length < 2 || input.trim().length > SECURITY_CONFIG.VALIDATION.MAX_NAME_LENGTH) {
        return { isValid: false, message: `Name must be between 2 and ${SECURITY_CONFIG.VALIDATION.MAX_NAME_LENGTH} characters` };
      }
      break;
      
    case 'password':
      const { PASSWORD } = SECURITY_CONFIG;
      if (input.length < PASSWORD.MIN_LENGTH || input.length > PASSWORD.MAX_LENGTH) {
        return { isValid: false, message: `Password must be between ${PASSWORD.MIN_LENGTH} and ${PASSWORD.MAX_LENGTH} characters` };
      }
      
      if (PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(input)) {
        return { isValid: false, message: 'Password must contain uppercase letters' };
      }
      
      if (PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(input)) {
        return { isValid: false, message: 'Password must contain lowercase letters' };
      }
      
      if (PASSWORD.REQUIRE_NUMBERS && !/\d/.test(input)) {
        return { isValid: false, message: 'Password must contain numbers' };
      }
      
      if (PASSWORD.REQUIRE_SPECIAL_CHARS && !new RegExp(`[${PASSWORD.SPECIAL_CHARS}]`).test(input)) {
        return { isValid: false, message: `Password must contain special characters (${PASSWORD.SPECIAL_CHARS})` };
      }
      break;
      
    case 'amount':
      const amount = parseFloat(input);
      if (isNaN(amount) || amount <= 0) {
        return { isValid: false, message: 'Invalid amount' };
      }
      
      if (amount > SECURITY_CONFIG.VALIDATION.MAX_TRANSFER_AMOUNT) {
        return { isValid: false, message: 'Amount exceeds maximum limit' };
      }
      break;
  }

  return { isValid: true };
};