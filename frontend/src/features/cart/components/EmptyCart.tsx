import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { EmptyCartProps } from "../types";

const EmptyCart = ({ onBrowseCatalogue }: EmptyCartProps) => {
  const handleBrowseCatalogue = () => {
    if (onBrowseCatalogue) {
      onBrowseCatalogue();
    } else {
      // Default behavior - navigate to catalogue
      window.location.href = "/catalogue";
    }
  };

  return (
    <Card className="border-[0.5px] border-black bg-white rounded-none">
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
        <ShoppingBag className="w-16 h-16 text-black/30" />
        <p className="text-black text-lg font-medium">Your cart is empty</p>
        <p className="text-black/60 text-sm">Add some items to get started</p>
        <Button
          variant="default"
          className="w-full rounded-full"
          onClick={handleBrowseCatalogue}
        >
          Browse Catalogue
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCart;
