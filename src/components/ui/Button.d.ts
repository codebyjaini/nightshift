import { ReactNode, MouseEvent } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

declare const Button: React.FC<ButtonProps>;
export default Button;
