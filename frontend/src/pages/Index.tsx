
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import Navigation from '@/components/Navigation';
import HeroGreeting from '@/components/HeroGreeting';
import StylingRequestForm from '@/components/StylingRequestForm';
import LoadingState from '@/components/LoadingState';
import RecommendationsFeed from '@/components/RecommendationsFeed';
import { Product } from '@/components/RecommendationsCard';
import { sampleProducts } from '@/data/sampleProducts';

const Home = () => {
  const [userName] = useState('Rayan'); // Would come from user authentication
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    requested: 0,
    bought: 0,
    owned: 0,
    disliked: 0
  });

  // Handle occasion selection
  const handleSelectOccasion = (occasion: string) => {
    setSelectedOccasion(occasion);
    setShowRecommendations(false);
  };

  // Handle form submission
  const handleGenerateRecommendations = (formData: {
    budget: number;
    itemCount: number;
    categories: string[];
  }) => {
    setIsLoading(true);
    setStats({
      requested: formData.itemCount,
      bought: 0,
      owned: 0,
      disliked: 0
    });
    
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts.slice(0, formData.itemCount));
      setIsLoading(false);
      setShowRecommendations(true);
      toast("Recommendations generated successfully!");
    }, 3000);
  };

  // Handle product actions
  const handleProductAction = (productId: string, action: 'wishlist' | 'dislike' | 'buy' | 'own' | 'more') => {
    // Update stats
    if (action === 'dislike') {
      setStats(prev => ({ ...prev, disliked: prev.disliked + 1 }));
      toast("Item disliked. We'll show you better options!");
    } else if (action === 'buy') {
      setStats(prev => ({ ...prev, bought: prev.bought + 1 }));
      toast("Item added to cart!");
    } else if (action === 'own') {
      setStats(prev => ({ ...prev, owned: prev.owned + 1 }));
      toast("Item added to your closet!");
    } else if (action === 'wishlist') {
      toast("Item added to your wishlist!");
    } else if (action === 'more') {
      toast("Finding more items like this...");
    }
    
    // Remove product from list (except for 'more' action)
    if (action !== 'more' && action !== 'wishlist') {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  // Generate new set
  const handleGenerateNewSet = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Shuffle products for demo purposes
      const shuffled = [...sampleProducts].sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, stats.requested));
      setIsLoading(false);
      toast("New recommendations generated!");
    }, 2000);
  };

  return (
    <div className="h-screen overflow-hidden bg-azugh-bg">
      <Navigation userName={userName} />
      
      <div className="h-[calc(100vh-64px)]">
        {!selectedOccasion && (
          <HeroGreeting 
            userName={userName} 
            onSelectOccasion={handleSelectOccasion} 
          />
        )}
        
        {selectedOccasion && !showRecommendations && (
          <StylingRequestForm 
            occasionType={selectedOccasion} 
            onGenerateRecommendations={handleGenerateRecommendations} 
          />
        )}
        
        {isLoading && <LoadingState />}
        
        {showRecommendations && !isLoading && (
          <RecommendationsFeed 
            products={products}
            requestedCount={stats.requested}
            bought={stats.bought}
            owned={stats.owned}
            disliked={stats.disliked}
            onAction={handleProductAction}
            onGenerateNewSet={handleGenerateNewSet}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
