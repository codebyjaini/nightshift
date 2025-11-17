import { ReactNode, MouseEvent, KeyboardEvent } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  hoverable?: boolean;
}

declare const Card: React.FC<CardProps>;
export default Card;
