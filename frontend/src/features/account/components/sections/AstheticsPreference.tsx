import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Shirt, RotateCcw, Ruler, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { AestheticsPreferences } from '../types';
import { AESTHETIC_STYLE_OPTIONS, SIZE_OPTIONS } from '@/data/OnboardingData';
import OnboardingModal from '@/pages/azugh/components/OnboardingModal';
import { useIsMobile } from "@/hooks/use-mobile";

interface AstheticsPreferenceProps {
  onBack: () => void;
}

// Add sizing system types and conversion data
type SizingSystem = 'EU' | 'UK' | 'US' | 'IT' | 'FR' | 'AU' | 'RU';

const SIZING_SYSTEMS = [
  { value: 'EU' as SizingSystem, label: 'EU', flag: '🇪🇺' },
  { value: 'UK' as SizingSystem, label: 'UK', flag: '🇬🇧' },
  { value: 'US' as SizingSystem, label: 'US', flag: '🇺🇸' },
  { value: 'IT' as SizingSystem, label: 'Italy', flag: '🇮🇹' },
  { value: 'FR' as SizingSystem, label: 'France', flag: '🇫🇷' },
  { value: 'AU' as SizingSystem, label: 'Australia', flag: '🇦🇺' },
  { value: 'RU' as SizingSystem, label: 'Russia', flag: '🇷🇺' },
];

// Size conversion mappings
const SIZE_CONVERSIONS = {
  CLOTHING: {
    EU: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    UK: ['4', '6', '8', '10', '12', '14', '16', '18', '20'],
    US: ['0', '2', '4', '6', '8', '10', '12', '14', '16'],
    IT: ['38', '40', '42', '44', '46', '48', '50'],
    FR: ['34', '36', '38', '40', '42', '44', '46'],
    AU: ['4', '6', '8', '10', '12', '14', '16'],
    RU: ['40', '42', '44', '46', '48', '50', '52'],
  },
  SHOE: {
    EU: Array.from({ length: 16 }, (_, i) => (35 + i).toString()),
    UK: ['2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5'],
    US: ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'],
    IT: Array.from({ length: 16 }, (_, i) => (35 + i).toString()),
    FR: Array.from({ length: 16 }, (_, i) => (35 + i).toString()),
    AU: ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'],
    RU: Array.from({ length: 16 }, (_, i) => (35 + i).toString()),
  }
};

type MultiSizeSizing = {
  [K in keyof AestheticsPreferences['sizing']]: string[];
};

type MultiSizeAestheticsPreferences = Omit<AestheticsPreferences, 'sizing'> & {
  sizing: MultiSizeSizing;
};

const getDefaultSizing = (system: SizingSystem): MultiSizeSizing => {
  const clothingSizes = SIZE_CONVERSIONS.CLOTHING[system];
  const shoeSizes = SIZE_CONVERSIONS.SHOE[system];
  const pick = (sizes: string[]) => sizes[Math.min(3, sizes.length - 1)];
  return {
    top: [pick(clothingSizes)],
    bottom: [pick(clothingSizes)],
    dress: [pick(clothingSizes)],
    shoe: [pick(shoeSizes)]
  };
};

const getSizeOptions = (category: keyof MultiSizeSizing, system: SizingSystem) =>
  category === 'shoe' ? SIZE_CONVERSIONS.SHOE[system] : SIZE_CONVERSIONS.CLOTHING[system];

const AstheticsPreference: React.FC<AstheticsPreferenceProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [sizingSystem, setSizingSystem] = useState<SizingSystem>('EU');
  const [aestheticsPrefs, setAestheticsPrefs] = useState<MultiSizeAestheticsPreferences>({
    selectedAesthetics: ['Clean Girl', 'Old Money', 'Parisian Woman', 'Scandi Minimalist'],
    sizing: getDefaultSizing('EU')
  });

  const handleSave = () => {
    toast.success("Aesthetics preferences updated successfully!");
  };

  const handleRetakeQuiz = () => {
    setShowOnboardingModal(true);
  };

  const handleModalClose = () => {
    setShowOnboardingModal(false);
    toast.success("Aesthetics quiz completed!");
  };

  const handleSizeChange = (category: keyof MultiSizeSizing, value: string) => {
    setAestheticsPrefs(prev => {
      const existing = prev.sizing[category];
      if (existing.includes(value)) {
        return prev;
      }
      return {
        ...prev,
        sizing: {
          ...prev.sizing,
          [category]: [...existing, value]
        }
      };
    });
  };

  const handleRemoveSize = (category: keyof MultiSizeSizing, value: string) => {
    setAestheticsPrefs(prev => ({
      ...prev,
      sizing: {
        ...prev.sizing,
        [category]: prev.sizing[category].filter(size => size !== value)
      }
    }));
  };

  const renderSelectedSizes = (category: keyof MultiSizeSizing) => {
    const selected = aestheticsPrefs.sizing[category];
    if (!selected.length) {
      return <p className="text-xs text-muted-foreground">No sizes selected</p>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {selected.map(size => (
          <span
            key={`${category}-${size}`}
            className="inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-xs"
          >
            {size}
            <button
              type="button"
              aria-label={`Remove ${size}`}
              onClick={() => handleRemoveSize(category, size)}
              className="text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    );
  };

  const handleSizingSystemChange = (newSystem: SizingSystem) => {
    setSizingSystem(newSystem);
    setAestheticsPrefs(prev => ({
      ...prev,
      sizing: getDefaultSizing(newSystem)
    }));
  };

  const getSelectedAestheticsData = () => {
    return AESTHETIC_STYLE_OPTIONS.filter(option =>
      aestheticsPrefs.selectedAesthetics.includes(option.label)
    );
  };

  // Mobile layout (existing functionality)
  if (isMobile) {
    return (
      <>
        <div className="w-full min-h-screen flex flex-col bg-white pb-[20vh] max-w-screen-xl md:max-w-full mx-auto overflow-y-auto">
          {/* Header */}
          <div className="flex items-center text-lg px-4 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-3 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-2xl text-black font-manrope lowercase tracking-wide">
              aesthetics
            </h1>
          </div>

          <div className="max-w-md mx-auto w-full px-4 space-y-6">
            {/* Your Aesthetics Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-black rounded-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <Shirt className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-light text-foreground">
                        your aesthetics
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        your personalized style preferences
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto hide-scrollbar">
                    <div className="flex space-x-3 pb-2" style={{ width: 'max-content' }}>
                      {getSelectedAestheticsData().map((aesthetic, index) => (
                        <motion.div
                          key={aesthetic.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex-shrink-0"
                        >
                          <div className="w-24 h-34 relative overflow-hidden border border-black shadow-sm">
                            <img
                              src={aesthetic.image}
                              alt={aesthetic.label}
                              className="w-full h-24 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/assets/fallback.png";
                              }}
                            />
                            <div className="p-2 h-10 flex items-center justify-center">
                              <p className="text-xs font-medium text-foreground text-center leading-tight">
                                {aesthetic.label}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Retake Aesthetics Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleRetakeQuiz}
                variant="outline"
                className="px-8 h-12 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Aesthetics Quiz
              </Button>
            </motion.div>

            {/* Sizing Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-border rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg font-light text-foreground">
                    sizing preferences
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    set your preferred sizes for different clothing categories
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sizing System Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="sizingSystem" className="text-sm font-medium text-foreground">
                      Sizing System
                    </Label>
                    <Select
                      value={sizingSystem}
                      onValueChange={(value: SizingSystem) => handleSizingSystemChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sizing system" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZING_SYSTEMS.map((system) => (
                          <SelectItem key={system.value} value={system.value}>
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{system.flag}</span>
                              <span>{system.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Fields */}
                  {(
                    [
                      { key: 'top', label: 'Top Size' },
                      { key: 'bottom', label: 'Bottom Size' },
                      { key: 'dress', label: 'Dress Size' }
                    ] as const
                  ).map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        {field.label} ({sizingSystem})
                      </Label>
                      <Select onValueChange={(value) => handleSizeChange(field.key, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Add ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getSizeOptions(field.key, sizingSystem).map((size) => (
                            <SelectItem
                              key={size}
                              value={size}
                              disabled={aestheticsPrefs.sizing[field.key].includes(size)}
                            >
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {renderSelectedSizes(field.key)}
                    </div>
                  ))}

                  {/* Shoe Size */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Shoe Size ({sizingSystem})
                    </Label>
                    <Select onValueChange={(value) => handleSizeChange('shoe', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add shoe size" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSizeOptions('shoe', sizingSystem).map((size) => (
                          <SelectItem
                            key={size}
                            value={size}
                            disabled={aestheticsPrefs.sizing.shoe.includes(size)}
                          >
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {renderSelectedSizes('shoe')}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pb-8"
            >
              <Button
                onClick={handleSave}
                className="w-full h-12 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal
          open={showOnboardingModal}
          onClose={handleModalClose}
          onboardingWidget="aesthetics"
          bgColor="bg-white"
          useImageBg={false}
          darkMode={true}
        />
      </>
    );
  }

  // Desktop embedded layout
  return (
    <>
      <div className="py-8 max-w-4xl md:max-w-full mx-auto bg-white">
        <div className="mb-3 px-5">
          <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
            Aesthetics & Sizing
          </h1>
          <p className="text-gray-600">Customize your style preferences and sizing information</p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Your Aesthetics Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='border border-black border-l-0 border-r-0 border-b-0'
          >
            <Card className="h-fit rounded-none shadow-none border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Shirt className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-light text-foreground">
                      your aesthetics
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      your personalized style preferences
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="shadow-none flex flex-col gap-8 border-b-0">
                <div className="grid grid-cols-4 gap-6 mb-6">
                  {getSelectedAestheticsData().map((aesthetic, index) => (
                    <motion.div
                      key={aesthetic.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="relative rounded-lg overflow-hidden border border-border shadow-sm w-full aspect-square flex flex-col justify-center items-center">
                        <img
                          src={aesthetic.image}
                          alt={aesthetic.label}
                          className="w-full h-full object-cover"
                          style={{ aspectRatio: "1/1" }}
                          onError={(e) => {
                            e.currentTarget.src = "/assets/fallback.png";
                          }}
                        />
                        <div className="p-2 absolute bottom-0 left-0 w-full bg-white/80">
                          <p className="text-xs font-medium text-foreground text-center leading-tight">
                            {aesthetic.label}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleRetakeQuiz}
                  className="px-8 h-12 flex self-end rounded-full bg-[#303A2FB2] text-white font-light lowercase text-base"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Aesthetics Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sizing Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-black border-r-0 border-l-0 border-b-0 rounded-none shadow-none h-fit">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Ruler className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-light text-foreground">
                      sizing preferences
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      set your preferred sizes for different clothing categories
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sizing System Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Sizing System
                  </Label>
                  <Select
                    value={sizingSystem}
                    onValueChange={(value: SizingSystem) => handleSizingSystemChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sizing system" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZING_SYSTEMS.map((system) => (
                        <SelectItem key={system.value} value={system.value}>
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{system.flag}</span>
                            <span>{system.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Fields - two per row */}
                <div className="grid grid-cols-2 gap-6">
                  {(
                    [
                      { key: 'top', label: 'Top Size' },
                      { key: 'bottom', label: 'Bottom Size' },
                      { key: 'dress', label: 'Dress Size' },
                      { key: 'shoe', label: 'Shoe Size' }
                    ] as const
                  ).map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        {field.label} ({sizingSystem})
                      </Label>
                      <Select onValueChange={(value) => handleSizeChange(field.key, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Add ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getSizeOptions(field.key, sizingSystem).map((size) => (
                            <SelectItem
                              key={size}
                              value={size}
                              disabled={aestheticsPrefs.sizing[field.key].includes(size)}
                            >
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {renderSelectedSizes(field.key)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 px-5 flex self-end"
          >
            <Button
              onClick={handleSave}
              className="px-8 h-12 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </motion.div>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal
          open={showOnboardingModal}
          onClose={handleModalClose}
          onboardingWidget="aesthetics"
          bgColor="bg-white"
          useImageBg={false}
          darkMode={true}
        />
      </div>
    </>
  );
};

export default AstheticsPreference;