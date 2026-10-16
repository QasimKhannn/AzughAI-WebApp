import type { ReactNode } from 'react';

export interface NavItem {
  icon: ReactNode;
  label: string;
  path: string;
  onClick: () => void;
  active: boolean;
}
