import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Heart, Star, MessageCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { Feedback } from '../types';
import { useIsMobile } from "@/hooks/use-mobile";

interface GiveFeedbackProps {
  onBack: () => void;
}

const GiveFeedback: React.FC<GiveFeedbackProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [feedback, setFeedback] = useState<Feedback>({
    rating: 0,
    comment: ''
  });

  const handleRatingChange = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (comment: string) => {
    setFeedback(prev => ({ ...prev, comment }));
  };

  const handleSubmit = () => {
    if (feedback.rating === 0) {
      toast.error("please provide a rating");
      return;
    }

    // Here you would typically send the feedback to your backend
    console.log('Feedback:', feedback);
    
    // Reset form
    setFeedback({
      rating: 0,
      comment: ''
    });
    
    toast.success("thank you for your feedback! it helps us improve azugh ai.");
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'poor';
      case 2: return 'fair';
      case 3: return 'good';
      case 4: return 'very good';
      case 5: return 'excellent';
      default: return '';
    }
  };

  const feedbackCategories = [
    { icon: '🎨', title: 'Style Recommendations', desc: 'How are our fashion suggestions?' },
    { icon: '🤖', title: 'AI Interactions', desc: 'Quality of AI conversations' },
    { icon: '📱', title: 'App Experience', desc: 'Overall app usability' },
    { icon: '🛒', title: 'Shopping Features', desc: 'Cart, wishlist, and checkout' }
  ];

  // Mobile layout
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
            give feedback
          </h1>
        </div>

        <div className="max-w-md mx-auto w-full px-4 space-y-6">
          {/* Feedback Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      your experience
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      help us improve by sharing your thoughts
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Section */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 lowercase">
                    how would you rate your overall experience?
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRatingChange(star)}
                        className="p-1"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= feedback.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {feedback.rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-muted-foreground font-light mt-2"
                    >
                      {getRatingText(feedback.rating)}
                    </motion.p>
                  )}
                </div>

                {/* Comment Section */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 lowercase">
                    additional comments (optional)
                  </h3>
                  <Textarea
                    value={feedback.comment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    className="font-light"
                    placeholder="tell us what you loved or what we could improve..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
                >
                  <Send className="mr-2 h-4 w-4" />
                  submit feedback
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Thank You Note */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border rounded-none">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-light">
                    your feedback is invaluable to us and helps make azugh ai better for everyone
                  </p>
                </div>
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
          Give Feedback
        </h1>
        <p className="text-gray-600">Your feedback helps us improve Azugh AI and provide better experiences</p>
      </div>

      <div className="w-full gap-8">

        {/* Right Column - Feedback Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      share your experience
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      tell us what you think about azugh ai
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Section */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4 lowercase">
                    how would you rate your overall experience?
                  </h3>
                  <div className="flex items-center justify-center space-x-3 py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRatingChange(star)}
                        className="p-2"
                      >
                        <Star
                          className={`h-10 w-10 transition-colors ${
                            star <= feedback.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-muted-foreground hover:text-yellow-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {feedback.rating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-lg font-medium text-foreground capitalize">
                        {getRatingText(feedback.rating)}
                      </p>
                      <p className="text-sm text-muted-foreground font-light">
                        Thank you for rating your experience
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Comment Section */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-3 lowercase">
                    additional comments (optional)
                  </h3>
                  <Textarea
                    value={feedback.comment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    className="font-light"
                    placeholder="Tell us what you loved, what could be improved, or any suggestions you have. Your detailed feedback helps us make Azugh AI better for everyone..."
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
                  disabled={feedback.rating === 0}
                >
                  <Send className="mr-2 h-4 w-4" />
                  submit feedback
                </Button>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-muted-foreground font-light">
                      Your feedback is invaluable to us and helps make Azugh AI better for everyone. 
                      We read every piece of feedback and use it to improve our service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GiveFeedback;