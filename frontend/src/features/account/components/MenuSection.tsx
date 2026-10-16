import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface MenuSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const MenuSection: React.FC<MenuSectionProps> = ({ children, delay = 0.2 }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Card className="border border-border p-2 rounded-none">
        <CardContent className="p-0">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuSection;
