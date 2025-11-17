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

declare const Input: React.FC<InputProps>;
export default Input;
