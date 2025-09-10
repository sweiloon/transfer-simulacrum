import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  className 
}) => {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    let feedback: string[] = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Lowercase letter');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Uppercase letter');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('Number');
    
    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Special character');
    
    const strength = score === 0 ? 'empty' : 
                     score <= 2 ? 'weak' : 
                     score <= 3 ? 'medium' : 
                     score <= 4 ? 'strong' : 'very-strong';
    
    return { strength, score, feedback };
  };

  const { strength, score, feedback } = getPasswordStrength(password);
  
  if (!password) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-destructive';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-blue-500';
      case 'very-strong': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      case 'very-strong': return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-300',
              getStrengthColor(strength)
            )}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className={cn(
          'text-xs font-medium',
          strength === 'weak' && 'text-destructive',
          strength === 'medium' && 'text-yellow-600',
          strength === 'strong' && 'text-blue-600',
          strength === 'very-strong' && 'text-green-600'
        )}>
          {getStrengthText(strength)}
        </span>
      </div>
      
      {feedback.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Missing: {feedback.join(', ')}
        </div>
      )}
    </div>
  );
};