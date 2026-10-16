
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type OccasionOption = {
  id: string;
  title: string;
  image: string;
};

interface HeroGreetingProps {
  userName: string;
  onSelectOccasion: (occasion: string) => void;
}

// Animation variants for the card
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const HeroGreeting: React.FC<HeroGreetingProps> = ({ userName, onSelectOccasion }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const occasionOptions: OccasionOption[] = [
    { 
      id: 'everyday', 
      title: 'Everyday', 
      image: 'public/lovable-uploads/8deb0646-fca8-414b-b94e-c38a0bcac8f0.png' 
    },
    { 
      id: 'workwear', 
      title: 'Workwear', 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop&q=80' 
    },
    { 
      id: 'nightout', 
      title: 'Night Out', 
      image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=600&fit=crop&q=80' 
    },
    { 
      id: 'travel', 
      title: 'Travel', 
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop&q=80' 
    },
    { 
      id: 'specialevent', 
      title: 'Special Event', 
      image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&h=600&fit=crop&q=80' 
    },
    { 
      id: 'custom', 
      title: 'Custom Occasion', 
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop&q=80' 
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === Math.ceil(occasionOptions.length / 3) - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.ceil(occasionOptions.length / 3) - 1 : prev - 1));
  };

  // Calculate visible cards for carousel (mobile)
  const visibleCards = occasionOptions.slice(currentSlide * 2, currentSlide * 2 + 2);

  return (
    <div className="w-full py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl lg:text-4xl font-manrope text-azugh-text mb-8 text-center md:text-left"
        >
          Hey {userName}, what's today's outfit about?
        </motion.h1>

        {/* Mobile Carousel */}
        <div className="relative md:hidden">
          <div className="flex overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {visibleCards.map((option, index) => (
                <motion.div
                  key={option.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="w-full min-w-[85vw] mx-2 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => onSelectOccasion(option.id)}
                >
                  <div className="relative h-48 md:h-64 w-full">
                    <div className="absolute inset-0 bg-gradient-overlay z-10"></div>
                    <img 
                      src={option.image} 
                      alt={option.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <h3 className="text-2xl sm:text-3xl font-manrope text-white drop-shadow-lg">
                        {option.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-azugh-bg/70 rounded-full p-2 backdrop-blur-sm"
          >
            <ChevronLeft className="text-azugh-accent" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-azugh-bg/70 rounded-full p-2 backdrop-blur-sm"
          >
            <ChevronRight className="text-azugh-accent" />
          </button>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {occasionOptions.map((option, index) => (
            <motion.div
              key={option.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => onSelectOccasion(option.id)}
            >
              <div className="relative h-48 md:h-64 w-full">
                <div className="absolute inset-0 bg-gradient-overlay z-10"></div>
                <img 
                  src={option.image} 
                  alt={option.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <h3 className="text-2xl sm:text-3xl font-manrope text-white drop-shadow-lg">
                    {option.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroGreeting;
