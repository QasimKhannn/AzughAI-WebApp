import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, DollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Carousel3D from "@/components/Carousel3D";

interface StylingRequestFormProps {
  occasionType: string;
  onGenerateRecommendations: (formData: {
    budget: number;
    itemCount: number;
    categories: string[];
  }) => void;
}

interface ClothingCategory {
  id: string;
  name: string;
  image: string;
}

const clothingCategories: ClothingCategory[] = [{
  id: "tops",
  name: "Tops",
  image: "https://images.unsplash.com/photo-1582142306909-195724d0a735?w=400&h=300&fit=crop&q=80"
}, {
  id: "bottoms",
  name: "Bottoms",
  image: "https://images.unsplash.com/photo-1549298916-f52d724204b4?w=400&h=300&fit=crop&q=80"
}, {
  id: "dresses",
  name: "Dresses",
  image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400&h=300&fit=crop&q=80"
}, {
  id: "outerwear",
  name: "Outerwear",
  image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop&q=80"
}, {
  id: "shoes",
  name: "Shoes",
  image: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=400&h=300&fit=crop&q=80"
}, {
  id: "bags",
  name: "Bags",
  image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&h=300&fit=crop&q=80"
}, {
  id: "accessories",
  name: "Accessories",
  image: "https://images.unsplash.com/photo-1587467512961-120760940315?w=400&h=300&fit=crop&q=80"
}, {
  id: "swimwear",
  name: "Swimwear",
  image: "https://images.unsplash.com/photo-1527434082571-473319ff8079?w=400&h=300&fit=crop&q=80"
}, {
  id: "activewear",
  name: "Activewear",
  image: "https://images.unsplash.com/photo-1517343985841-f8b2d66e010b?w=400&h=300&fit=crop&q=80"
}, {
  id: "loungewear",
  name: "Loungewear",
  image: "https://images.unsplash.com/photo-1616177635753-920dee141885?w=400&h=300&fit=crop&q=80"
}];

const StylingRequestForm: React.FC<StylingRequestFormProps> = ({
  occasionType,
  onGenerateRecommendations
}) => {
  const [budget, setBudget] = useState(500);
  const [itemCount, setItemCount] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetPerItem, setBudgetPerItem] = useState(0);

  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      setBudgetPerItem(Math.floor(budget / Math.min(selectedCategories.length, itemCount)));
    } else {
      setBudgetPerItem(0);
    }
  }, [budget, itemCount, selectedCategories]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const incrementItemCount = () => {
    if (itemCount < 10) setItemCount(itemCount + 1);
  };

  const decrementItemCount = () => {
    if (itemCount > 1) setItemCount(itemCount - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateRecommendations({
      budget,
      itemCount,
      categories: selectedCategories
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto px-8"
      >
        <motion.h2 
          className="text-2xl md:text-3xl font-manrope text-azugh-accent mb-12 text-center tracking-wide"
          initial={{ opacity: 0, y: -50, scale: 0.9, rotateX: 45 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          Give me the budget, and I'll make magic.
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-xl mx-auto">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <label className="text-base text-azugh-text/90 font-medium">BUDGET</label>
                <motion.div 
                  className="flex items-center text-azugh-accent font-medium bg-azugh-highlight/10 px-4 py-2 rounded-full"
                  layout
                  transition={springConfig}
                >
                  <DollarSign size={18} />
                  <motion.span
                    key={budget}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={springConfig}
                  >
                    {budget}
                  </motion.span>
                </motion.div>
              </div>
              <Slider 
                value={[budget]} 
                min={100} 
                max={2000} 
                step={50} 
                onValueChange={value => setBudget(value[0])} 
                className="w-full"
              />
            </motion.div>

            <motion.div 
              className="space-y-4 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-base text-azugh-text/90 font-medium">NUMBER OF ITEMS</label>
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={decrementItemCount} 
                    className="border-azugh-highlight text-azugh-accent hover:bg-azugh-highlight/10 rounded-full"
                    disabled={itemCount <= 1}
                  >
                    <ChevronDown size={16} />
                  </Button>
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={itemCount}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={springConfig}
                    className="w-12 text-center font-medium text-2xl"
                  >
                    {itemCount}
                  </motion.span>
                </AnimatePresence>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={incrementItemCount} 
                    className="border-azugh-highlight text-azugh-accent hover:bg-azugh-highlight/10 rounded-full"
                    disabled={itemCount >= 10}
                  >
                    <ChevronUp size={16} />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-base text-azugh-text/90 font-medium block text-center mb-6">CATEGORIES</label>
            <Carousel3D 
              categories={clothingCategories}
              onSelect={handleCategoryToggle}
              selectedCategories={selectedCategories}
            />
          </motion.div>
          
          {selectedCategories.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="text-center text-base bg-azugh-highlight/10 py-3 px-5 rounded-full mx-auto w-fit"
            >
              Approximately <span className="font-semibold text-azugh-accent">${budgetPerItem}</span> per item
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }} 
            className="pt-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-azugh-accent hover:bg-azugh-accent/90 text-white py-7 rounded-xl text-lg font-medium shadow-md" 
                disabled={selectedCategories.length === 0}
              >
                Generate Recommendations
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default StylingRequestForm;
