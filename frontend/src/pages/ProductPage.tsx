
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Heart, ShoppingCart, ArrowLeft, Check, Share2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Product } from '@/components/RecommendationsCard';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// Sample products - in a real app, this would come from an API
import { sampleProducts } from '@/data/sampleProducts';

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulating API call to fetch product
    setIsLoading(true);
    
    // Find the product in our sample data
    setTimeout(() => {
      const foundProduct = sampleProducts.find(p => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Get some related products (just random ones for this demo)
        const related = sampleProducts
          .filter(p => p.id !== productId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
          
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
    }, 500);
  }, [productId]);

  const handleAddToCart = () => {
    toast("Added to cart!");
  };

  const handleAddToWishlist = () => {
    toast("Added to wishlist!");
  };

  const handleBackToResults = () => {
    navigate(-1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-azugh-bg">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="w-full h-64 animate-pulse bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-azugh-bg">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-2xl font-manrope text-azugh-accent mb-4">Product Not Found</h2>
          <Button onClick={() => navigate("/")} className="bg-azugh-accent hover:bg-azugh-accent/90 text-white">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-azugh-bg">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
      >
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={handleBackToResults}
            className="text-azugh-accent hover:text-azugh-highlight flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to results
          </Button>
        </motion.div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-lg overflow-hidden aspect-[3/4] bg-white"
          >
            <img 
              src={product.image} 
              alt={product.description} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-3xl md:text-4xl font-manrope text-azugh-accent mb-2">
              {product.brand}
            </h1>
            
            <h2 className="text-xl text-azugh-text mb-4">
              {product.description}
            </h2>
            
            <div className="text-2xl font-semibold text-azugh-accent mb-8">
              ${product.price}
            </div>
            
            {product.size && (
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-wider text-azugh-text/70 mb-2">Size</h3>
                <div className="inline-block px-4 py-2 border border-azugh-highlight rounded-md bg-azugh-highlight/10 text-azugh-accent">
                  {product.size}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                className="bg-azugh-accent hover:bg-azugh-accent/90 text-white flex-1 py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2" size={18} />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                className="border-azugh-accent text-azugh-accent hover:bg-azugh-accent/10 flex-1"
                onClick={handleAddToWishlist}
              >
                <Heart className="mr-2" size={18} />
                Add to Wishlist
              </Button>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-azugh-text/10">
              <Button 
                variant="ghost" 
                className="text-azugh-accent hover:text-azugh-highlight"
                onClick={handleShare}
              >
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-azugh-accent hover:text-azugh-highlight"
                  >
                    <Check size={18} className="mr-2" />
                    Sustainability
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Sustainable Materials</h4>
                    <p className="text-sm">
                      This item is made with sustainable practices and eco-friendly materials, reducing environmental impact.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </motion.div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-2xl font-manrope text-azugh-accent mb-6">
              You May Also Like
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden group">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.description} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="secondary"
                        onClick={() => navigate(`/product/${relatedProduct.id}`)}
                        className="bg-white/80 hover:bg-white text-azugh-accent"
                      >
                        View Item
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-manrope text-azugh-accent">{relatedProduct.brand}</h4>
                    <p className="text-sm text-azugh-text">{relatedProduct.description}</p>
                    <p className="mt-2 font-medium">${relatedProduct.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductPage;
