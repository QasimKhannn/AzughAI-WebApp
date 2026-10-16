import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NavItem as NavItemType } from '../types';

export interface NavItemProps {
  item: NavItemType;
  isMobile?: boolean;
}

const mobileVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const mobileTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 80,
  mass: 2,
  velocity: 0,
};

export default function NavItem({ item, isMobile = false }: NavItemProps) {
  if (isMobile) {
    return (
      <motion.div
        variants={mobileVariants}
        transition={mobileTransition}
        className="relative"
      >
        <Link
          to={item.path}
          className={`transition font-light text-2xl relative
        ${item.active
          ? 'text-[#AA9C64]'
          : 'text-gray-900 hover:text-[#AA9C64]'
        }`}
          onClick={item.onClick}
        >
          {item.label}
          {item.active && (
        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#AA9C64] rounded" />
          )}
        </Link>
      </motion.div>
    );
  }

  // Desktop variant
  return (
    <Link
      to={item.path}
      onClick={item.onClick}
      className={`font-light lowercase text-base transition-colors duration-200 relative
        ${item.active
          ? 'text-azugh-highlight'
          : 'text-gray-900 hover:text-azugh-highlight'
        }`}
    >
      {item.label}
      {item.active && (
        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-azugh-highlight rounded" />
      )}
    </Link>
  );
}