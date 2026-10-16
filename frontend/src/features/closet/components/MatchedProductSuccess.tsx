import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ITEMS_OPTIONS } from '../mockData';
import { useNavigate, useLocation } from 'react-router-dom'; // <-- add useLocation
import ImageIcon from '@/components/icons/ImageIcon';

const MatchedProductSuccess: React.FC = () => {
  const product = ITEMS_OPTIONS[0];
  const navigate = useNavigate();
  const location = useLocation(); // <-- get location
  const isManual = location.state?.manual; // <-- check flag

  return (
    <div
      className="
        w-full relative
        min-h-screen h-[100vh]
        flex flex-col overflow-hidden bg-white
        max-w-screen-xl md:max-w-full mx-auto
      "
    >
      <ArrowLeft onClick={() => navigate(-1)} className="absolute left-4 mt-4 z-10 cursor-pointer" />

      {/* Scrollable content pane */}
      <div
        className="flex-1 min-h-0 overflow-y-auto
        pb-[calc(env(safe-area-inset-bottom)+20vh)]
                   flex flex-col items-center py-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex flex-col items-center mb-1">
          <ImageIcon name="heart-check.svg" className="w-24 h-24 text-[#303A2FB2]" />
          <h2 className="text-2xl font-manrope mb-1">
            {isManual ? 'item saved manually' : 'item added'}
          </h2>
          <p className="text-base font-manrope mb-4">
            {isManual ? 'your item was saved to your closet' : 'your item is now in your closet'}
          </p>
        </div>

        <div className="w-[60%] md:w-[32%] height-auto mb-6">
          <ProductCard
            id={product.label}
            name={product.label}
            brand={product.brand}
            // price={product.price}
            image={product.images?.[0] || '/assets/dummy-img.png'}
            showCart={false}
            showHeart={false}
            showPrice={true}
            className="border border-black"
          />
        </div>

        <Button
          onClick={() => navigate('/closet')}
          className="w-[60%] max-w-xs sm:max-w-sm md:max-w-md rounded-full
                     bg-[#303A2FB2] hover:bg-[#303A2FB2]
                     text-white font-light text-base"
        >
          view in closet
        </Button>
        {/* Spacer so last item isn't tight against bottom safe area */}
        <div className="h-24" />
      </div>
    </div>
  );
};

export default MatchedProductSuccess;
