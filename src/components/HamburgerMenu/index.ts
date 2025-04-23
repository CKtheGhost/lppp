export { default } from './HamburgerMenu';

export interface HamburgerMenuProps {
  onJoinClick: () => void;
  navigationItems?: Array<{
    id: string;
    label: string;
  }>;
}