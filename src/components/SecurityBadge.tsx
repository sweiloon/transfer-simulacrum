import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ 
  className,
  showDetails = false 
}) => {
  const securityFeatures = [
    'End-to-end encryption',
    'Multi-factor authentication ready',
    'Secure data transmission',
    'Regular security audits',
    'GDPR compliant'
  ];

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <div className="flex items-center gap-1 text-green-600">
        <Shield className="h-4 w-4" />
        <Lock className="h-3 w-3" />
        <span className="font-medium">Secured</span>
      </div>
      
      {showDetails && (
        <div className="hidden lg:flex items-center gap-1 text-muted-foreground">
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-xs">Bank-grade security</span>
          </div>
        </div>
      )}
    </div>
  );
};