import { ReactNode, MouseEvent, KeyboardEvent, ChangeEvent } from 'react';

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

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  hoverable?: boolean;
}

export interface BadgeProps {
  variant?: 'critical' | 'medium' | 'low' | 'treated' | 'untreated';
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'number' | 'textarea';
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps>;
export const Card: React.FC<CardProps>;
export const Badge: React.FC<BadgeProps>;
export const Input: React.FC<InputProps>;
export const Modal: React.FC<ModalProps>;
export const LoadingSpinner: React.FC<LoadingSpinnerProps>;
export const ErrorMessage: React.FC<ErrorMessageProps>;
