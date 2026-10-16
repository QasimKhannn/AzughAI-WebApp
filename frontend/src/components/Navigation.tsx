
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

interface NavigationProps {
  userName?: string;
}

const Navigation: React.FC<NavigationProps> = ({ userName = "Rayan" }) => {
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "CLOSET", path: "/closet" },
    { name: "WISHLIST", path: "/wishlist" },
    { name: "ACCOUNT", path: "/account" }
  ];

  return (
    <nav className="w-full px-4 sm:px-6 py-6 backdrop-blur-md bg-azugh-bg/90 border-b border-azugh-text/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center animate-fade-in-slow">
          <p className="text-azugh-accent font-manrope text-xs tracking-widest">HELLO, {userName.toUpperCase()}</p>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 animate-fade-in-slow">
          <Link to="/" className="flex items-center group">
            <img 
              src="/lovable-uploads/49eab98d-7b43-4a8c-8be1-66175990c4e0.png" 
              alt="azugh logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 animate-fade-in-slow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="uppercase text-azugh-accent text-xs font-manrope tracking-widest hover:text-azugh-highlight transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden animate-fade-in-slow">
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-azugh-accent hover:text-azugh-highlight transition-colors">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent className="bg-azugh-bg border-azugh-text/10">
              <div className="flex flex-col space-y-8 mt-16">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="uppercase text-azugh-accent text-sm font-manrope tracking-widest hover:text-azugh-highlight transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-8 mt-auto">
                  <p className="text-xs text-center text-azugh-accent/60 font-manrope tracking-wider">
                    AN AI COMPANION THAT BRINGS<br />SOFTNESS & FLOW INTO<br />EVERY SHOPPING CHOICE
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
