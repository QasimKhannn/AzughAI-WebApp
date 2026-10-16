
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsDown, ShoppingCart, Check, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface Product {
  id: string;
  image: string;
  brand: string;
  description: string;
  price: number;
  size?: string;
}

interface RecommendationsCardProps {
  product: Product;
  onAction: (productId: string, action: 'wishlist' | 'dislike' | 'buy' | 'own' | 'more') => void;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ product, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden shadow-md border border-azugh-highlight/10 group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.description} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-azugh-bg/80 backdrop-blur-sm px-3 py-1 rounded-full text-azugh-accent font-medium">
          ${product.price}
        </div>
        
        {/* Size tag (if available) */}
        {product.size && (
          <div className="absolute top-3 left-3 bg-azugh-accent/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
            Size: {product.size}
          </div>
        )}
        
        {/* Quick view button - visible on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to={`/product/${product.id}`}>
            <Button 
              variant="secondary"
              size="sm"
              className="bg-azugh-bg/80 backdrop-blur-sm hover:bg-azugh-accent text-azugh-accent hover:text-white transition-colors gap-1"
            >
              <Eye size={16} />
              Quick View
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-manrope text-azugh-accent text-lg mb-1">{product.brand}</h3>
        <p className="text-azugh-text text-sm mb-4">{product.description}</p>
        
        {/* Action buttons - visible only on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="grid grid-cols-5 gap-2 w-full">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => onAction(product.id, 'wishlist')}
              className="rounded-full hover:bg-azugh-highlight/10 text-azugh-accent"
              title="Add to Wishlist"
            >
              <Heart size={18} />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => onAction(product.id, 'dislike')}
              className="rounded-full hover:bg-azugh-highlight/10 text-azugh-accent"
              title="Dislike"
            >
              <ThumbsDown size={18} />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => onAction(product.id, 'buy')}
              className="rounded-full hover:bg-azugh-highlight/10 text-azugh-accent"
              title="Buy"
            >
              <ShoppingCart size={18} />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => onAction(product.id, 'own')}
              className="rounded-full hover:bg-azugh-highlight/10 text-azugh-accent"
              title="I Own This"
            >
              <Check size={18} />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => onAction(product.id, 'more')}
              className="rounded-full hover:bg-azugh-highlight/10 text-azugh-accent"
              title="More Like This"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationsCard;
