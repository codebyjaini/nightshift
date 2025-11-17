import { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'critical' | 'medium' | 'low' | 'treated' | 'untreated';
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

declare const Badge: React.FC<BadgeProps>;
export default Badge;
