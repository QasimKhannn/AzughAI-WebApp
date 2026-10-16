import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronRight, Search, BookOpen, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FAQItem } from '../types';
import { useIsMobile } from "@/hooks/use-mobile";

interface HelpSectionProps {
  onBack: () => void;
}

const HelpSection: React.FC<HelpSectionProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [faqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'how do i update my style preferences?',
      answer: 'you can update your style preferences by going to the aesthetics section in your account settings. there you can retake the aesthetics quiz or manually adjust your sizing preferences.',
      category: 'styling'
    },
    {
      id: '2',
      question: 'how does azugh ai work?',
      answer: 'azugh ai uses advanced machine learning to understand your personal style, preferences, and lifestyle. it analyzes your choices, feedback, and style history to provide personalized fashion recommendations tailored specifically to you.',
      category: 'ai'
    },
    {
      id: '3',
      question: 'can i change my subscription plan?',
      answer: 'yes, you can upgrade or downgrade your subscription plan at any time through the payment section in your account settings. changes will be reflected in your next billing cycle.',
      category: 'billing'
    },
    {
      id: '4',
      question: 'how do i add items to my closet?',
      answer: 'you can add items to your closet by taking photos of your clothing items or manually entering item details. azugh ai will help categorize and organize your closet automatically.',
      category: 'closet'
    },
    {
      id: '5',
      question: 'what if i don\'t like a recommendation?',
      answer: 'you can provide feedback on any recommendation by rating it. this helps azugh ai learn your preferences better and improve future recommendations. you can also give detailed feedback through the feedback section.',
      category: 'styling'
    },
    {
      id: '6',
      question: 'how do i cancel my subscription?',
      answer: 'to cancel your subscription, please contact our support team through the contact support section. we\'ll be happy to help you with the cancellation process and answer any questions you might have.',
      category: 'billing'
    },
    {
      id: '7',
      question: 'is my data secure?',
      answer: 'yes, we take data security very seriously. all your personal information and style preferences are encrypted and stored securely. please refer to our privacy policy for detailed information about how we handle your data.',
      category: 'privacy'
    },
    {
      id: '8',
      question: 'how often are new features added?',
      answer: 'we continuously work on improving azugh ai and adding new features. major updates are typically released monthly, with smaller improvements and bug fixes deployed regularly.',
      category: 'general'
    }
  ]);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
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
            help
          </h1>
        </div>

        <div className="max-w-md mx-auto w-full px-4 space-y-6">
          {/* Search */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 font-light"
              />
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      frequently asked questions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      find answers to common questions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-light">no results found</p>
                    <p className="text-sm text-muted-foreground font-light">try different search terms</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <div
                        className="border border-border p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <h3 className="text-foreground font-light text-sm pr-4">
                              {faq.question}
                            </h3>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-border"
                          >
                            <p className="text-sm text-muted-foreground font-light">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Desktop embedded layout
  return (
    <div className="p-8 max-w-4xl md:max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
          Help & Support
        </h1>
        <p className="text-gray-600">Find answers to common questions and get the help you need</p>
      </div>

      <div className="w-full gap-8">
        {/* Right Column - Search and FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 font-light"
              />
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      frequently asked questions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      find answers to common questions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-light">no results found</p>
                    <p className="text-sm text-muted-foreground font-light">try different search terms</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <div
                        className="border border-border p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <h3 className="text-foreground font-light text-sm pr-4">
                              {faq.question}
                            </h3>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-border"
                          >
                            <p className="text-sm text-muted-foreground font-light">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;