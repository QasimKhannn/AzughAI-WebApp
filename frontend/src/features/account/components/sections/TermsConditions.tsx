import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from "@/hooks/use-mobile";

interface TermsConditionsProps {
  onBack: () => void;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  const isMobile = useIsMobile();

  const termsSections = [
    {
      id: '1',
      title: 'acceptance of terms',
      content: 'by accessing and using azugh ai, you accept and agree to be bound by the terms and provision of this agreement.',
      icon: <Scale className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'use license',
      content: 'azugh ai grants you a personal, non-exclusive, non-transferable license to use the service for personal styling and fashion recommendations.',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'user account',
      content: 'you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'subscription and payments',
      content: 'subscription fees are billed in advance on a monthly basis. cancellations take effect at the end of the current billing period.',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: '5',
      title: 'content and recommendations',
      content: 'azugh ai provides personalized fashion recommendations based on your preferences. recommendations are suggestions only and not guarantees.',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: '6',
      title: 'prohibited uses',
      content: 'you may not use the service for any unlawful purpose or to solicit others to perform unlawful acts.',
      icon: <AlertCircle className="h-5 w-5" />
    },
    {
      id: '7',
      title: 'limitation of liability',
      content: 'azugh ai shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of the service.',
      icon: <Scale className="h-5 w-5" />
    },
    {
      id: '8',
      title: 'changes to terms',
      content: 'we reserve the right to modify these terms at any time. continued use of the service constitutes acceptance of modified terms.',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: '9',
      title: 'contact information',
      content: 'for questions about these terms, please contact us through the support section in your account settings.',
      icon: <Shield className="h-5 w-5" />
    }
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
            terms & conditions
          </h1>
        </div>

        <div className="max-w-md mx-auto w-full px-4 space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      terms of service
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      last updated: september 30, 2024
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 text-sm text-foreground font-light">
                  {termsSections.map((section) => (
                    <section key={section.id}>
                      <h3 className="font-medium text-foreground lowercase mb-2">
                        {section.id}. {section.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {section.content}
                      </p>
                    </section>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground font-light text-center">
                    these terms are subject to review and refinement with legal counsel
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
    <div className="p-8 max-w-5xl md:max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
          Terms & Conditions
        </h1>
        <p className="text-gray-600">Legal terms governing your use of Azugh AI services</p>
        <p className="text-sm text-muted-foreground mt-1">Last updated: September 30, 2024</p>
      </div>

      <div className="w-full gap-8">
        {/* Right Column - Terms Content */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-light text-foreground">
                  Terms of Service Details
                </CardTitle>
                <p className="text-sm text-muted-foreground font-light">
                  comprehensive terms governing your use of azugh ai
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {termsSections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-muted-foreground mt-1">
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground lowercase mb-2">
                            {section.id}. {section.title}
                          </h3>
                          <p className="text-sm text-muted-foreground font-light leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Legal Notice</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">
                      These terms are subject to review and refinement with legal counsel. 
                      We reserve the right to update these terms as needed to reflect changes in our service or legal requirements.
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

export default TermsConditions;