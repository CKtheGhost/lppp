export { default } from './QuantumSidebar';

export interface QuantumSidebarProps {
  remainingSpots: number;
  totalSpots: number;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  onButtonClick: () => void;
  alwaysVisible?: boolean;
}