
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import RecommendationsCard, { Product } from './RecommendationsCard';
import { RefreshCw } from 'lucide-react';

interface RecommendationsFeedProps {
  products: Product[];
  requestedCount: number;
  bought: number;
  owned: number;
  disliked: number;
  onAction: (productId: string, action: 'wishlist' | 'dislike' | 'buy' | 'own' | 'more') => void;
  onGenerateNewSet: () => void;
}

const RecommendationsFeed: React.FC<RecommendationsFeedProps> = ({
  products,
  requestedCount,
  bought,
  owned,
  disliked,
  onAction,
  onGenerateNewSet
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-8 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-manrope text-azugh-accent mb-4 text-center sm:text-left"
        >
          Your Vibe, Your Picks
        </motion.h2>
        
        {/* Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 text-azugh-text text-center sm:text-left"
        >
          <p className="text-sm md:text-base">
            You requested {requestedCount} items. {bought} bought, {owned} owned, {disliked} disliked
            {" — "}finding {requestedCount - (bought + owned + disliked)} more…
          </p>
        </motion.div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <RecommendationsCard 
                product={product} 
                onAction={onAction} 
              />
            </motion.div>
          ))}
        </div>
        
        {/* Generate New Set Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center"
        >
          <Button 
            onClick={onGenerateNewSet}
            className="bg-azugh-accent hover:bg-azugh-accent/90 text-white flex items-center space-x-2 px-6 py-6"
          >
            <RefreshCw size={16} />
            <span>Generate New Set</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecommendationsFeed;
