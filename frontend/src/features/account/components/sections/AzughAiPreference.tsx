import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Bot, Briefcase, Heart, Lightbulb, Volume2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { AzughAIPreferences, ToneOption, VoiceOption } from '../types';
import { useIsMobile } from "@/hooks/use-mobile";

interface AzughAiPreferenceProps {
  onBack: () => void;
}

const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'professional',
    title: 'Professional',
    description: 'Formal, business-like, and detail-oriented approach',
    icon: Briefcase
  },
  {
    id: 'friendly',
    title: 'Friendly',
    description: 'Warm, approachable, and conversational style',
    icon: Heart
  },
  {
    id: 'creative',
    title: 'Creative',
    description: 'Innovative, expressive, and imaginative responses',
    icon: Lightbulb
  }
];

const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'alloy',
    name: 'the curator',
    description: 'Balanced and versatile — a refined, composed stylist\'s voice'
  },
  {
    id: 'echo',
    name: 'the muse',
    description: 'Warm and expressive - inspires connection and emotion'
  },
  {
    id: 'fable',
    name: 'the oracle',
    description: 'Clear and articulate - delivers insight with editorial clarity'
  },
  {
    id: 'onyx',
    name: 'the auteur',
    description: 'Deep and resonant - commanding, authoritative, magnetic'
  },
  {
    id: 'nova',
    name: 'the visionary',
    description: 'Bright and energetic - bold, future-minded, and dynamic'
  }
];

const AzughAiPreference: React.FC<AzughAiPreferenceProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [aiPreferences, setAiPreferences] = useState<AzughAIPreferences>({
    tone: 'friendly',
    voice: 'alloy',
    behavior: 'Be helpful and enthusiastic about fashion. Provide personalized recommendations based on my style preferences and suggest trendy combinations.'
  });

  const handleSave = () => {
    toast.success("Azugh AI preferences updated successfully!");
  };

  const handleToneChange = (tone: 'professional' | 'friendly' | 'creative') => {
    setAiPreferences(prev => ({ ...prev, tone }));
  };

  const handleVoiceChange = (voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova') => {
    setAiPreferences(prev => ({ ...prev, voice }));
  };

  const handleBehaviorChange = (behavior: string) => {
    setAiPreferences(prev => ({ ...prev, behavior }));
  };

  // Mobile layout (existing functionality)
  if (isMobile) {
    return (
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
            Azugh AI
          </h1>
        </div>

        <div className="max-w-md mx-auto w-full px-4 space-y-6">
          {/* AI Assistant Overview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      your azugh ai
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      customize how azugh ai interacts with you
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Tone Selection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Personality Tone
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose how Azugh AI should communicate with you
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {TONE_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = aiPreferences.tone === option.id;
                  
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 border ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-border hover:border-primary/50 hover:shadow-sm'
                        }`}
                        onClick={() => handleToneChange(option.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-foreground">{option.title}</h3>
                                {isSelected && (
                                  <Check className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Voice Selection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Voice Selection
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred AI voice
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {VOICE_OPTIONS.map((voice) => {
                  const isSelected = aiPreferences.voice === voice.id;
                  
                  return (
                    <motion.div
                      key={voice.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleVoiceChange(voice.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Volume2 className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{voice.name}</h4>
                            <p className="text-sm text-muted-foreground">{voice.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Behavior Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Behavior Instructions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe how you want Azugh AI to behave and assist you
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="behavior" className="text-sm font-medium text-foreground">
                      Custom Instructions
                    </Label>
                    <Textarea
                      id="behavior"
                      value={aiPreferences.behavior}
                      onChange={(e) => handleBehaviorChange(e.target.value)}
                      className="mt-2 min-h-[120px]"
                      placeholder="Tell Azugh AI how you want it to behave, what kind of assistance you prefer, and any specific preferences you have..."
                    />
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-foreground mb-2">💡 Examples:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• "Be enthusiastic about sustainable fashion and eco-friendly brands"</li>
                      <li>• "Focus on minimalist and classic styles"</li>
                      <li>• "Always consider my budget when making recommendations"</li>
                      <li>• "Ask follow-up questions to better understand my preferences"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pb-8"
          >
            <Button 
              onClick={handleSave} 
              className="w-full h-12 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
            >
              <Save className="mr-2 h-4 w-4" />
              Save AI Preferences
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Desktop embedded layout
  return (
    <div className="py-8 max-w-4xl md:max-w-full">
      <div className="mb-3 px-5">
        <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
          Azugh AI Preferences
        </h1>
        <p className="text-gray-600">Customize how Azugh AI interacts with you and assists with your fashion choices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 border border-black border-l-0">
        {/* Left Column - Tone and Voice */}
        <div>
          {/* Tone Selection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-black rounded-none shadow-none border-t-0 border-l-0">
              <CardHeader>
                <CardTitle className="text-lg font-light text-foreground">
                  Personality Tone
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose how Azugh AI should communicate with you
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {TONE_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = aiPreferences.tone === option.id;
                  
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 border ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-border hover:border-primary/50 hover:shadow-sm'
                        }`}
                        onClick={() => handleToneChange(option.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-foreground">{option.title}</h3>
                                {isSelected && (
                                  <Check className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Voice Selection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='p-0 m-0'
          >
            <Card className="border border-black shadow-none rounded-none border-t-0 border-l-0 border-b-0">
              <CardHeader>
                <CardTitle className="text-lg font-light text-foreground">
                  Voice Selection
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred AI voice personality
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {VOICE_OPTIONS.map((voice) => {
                  const isSelected = aiPreferences.voice === voice.id;
                  
                  return (
                    <motion.div
                      key={voice.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleVoiceChange(voice.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Volume2 className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{voice.name}</h4>
                            <p className="text-sm text-muted-foreground">{voice.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Behavior Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-none border-0 h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-light text-foreground">
                Behavior Instructions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Describe how you want Azugh AI to behave and assist you
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="behavior" className="text-sm font-medium text-foreground">
                    Custom Instructions
                  </Label>
                  <Textarea
                    id="behavior"
                    value={aiPreferences.behavior}
                    onChange={(e) => handleBehaviorChange(e.target.value)}
                    className="mt-2 min-h-[200px]"
                    placeholder="Tell Azugh AI how you want it to behave, what kind of assistance you prefer, and any specific preferences you have..."
                  />
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-foreground mb-3">💡 Examples:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• "Be enthusiastic about sustainable fashion and eco-friendly brands"</li>
                    <li>• "Focus on minimalist and classic styles"</li>
                    <li>• "Always consider my budget when making recommendations"</li>
                    <li>• "Ask follow-up questions to better understand my preferences"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 px-5"
      >
        <Button 
          onClick={handleSave} 
          className="px-8 h-12 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
        >
          <Save className="mr-2 h-4 w-4" />
          Save AI Preferences
        </Button>
      </motion.div>
    </div>
  );
};

export default AzughAiPreference;