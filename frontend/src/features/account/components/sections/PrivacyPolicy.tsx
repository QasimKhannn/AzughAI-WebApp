import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from "@/hooks/use-mobile";

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const isMobile = useIsMobile();

  const privacySections = [
    {
      id: '1',
      title: 'information we collect',
      content: 'we collect information you provide directly to us, such as your style preferences, measurements, and account details necessary for personalized recommendations.',
      icon: <Eye className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'how we use your information',
      content: 'your information is used to provide personalized fashion recommendations, improve our ai algorithms, and enhance your overall experience with azugh ai.',
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'data sharing',
      content: 'we do not sell, trade, or otherwise transfer your personal information to third parties except as described in this privacy policy or with your consent.',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'data security',
      content: 'we implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      icon: <Lock className="h-5 w-5" />
    },
    {
      id: '5',
      title: 'cookies and tracking',
      content: 'we use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content.',
      icon: <Eye className="h-5 w-5" />
    },
    {
      id: '6',
      title: 'data retention',
      content: 'we retain your personal information for as long as necessary to provide our services or as required by law.',
      icon: <Lock className="h-5 w-5" />
    },
    {
      id: '7',
      title: 'your rights',
      content: 'you have the right to access, update, or delete your personal information. you may also opt out of certain communications from us.',
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      id: '8',
      title: 'children\'s privacy',
      content: 'our service is not intended for children under 16. we do not knowingly collect personal information from children under 16.',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: '9',
      title: 'international users',
      content: 'if you are accessing our service from outside the united states, please be aware that your information may be transferred to and processed in the united states.',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: '10',
      title: 'changes to privacy policy',
      content: 'we may update this privacy policy from time to time. we will notify you of any material changes by posting the new policy on this page.',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: '11',
      title: 'contact us',
      content: 'if you have any questions about this privacy policy, please contact us through the support section in your account settings.',
      icon: <UserCheck className="h-5 w-5" />
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
            privacy policy
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
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      your privacy matters
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      last updated: september 30, 2024
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 text-sm text-foreground font-light">
                  {privacySections.map((section) => (
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
                    this policy will be refined and reviewed with legal counsel before final implementation
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
    <div className="p-8 pt-0 bg-white max-w-5xl md:max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-600">How we collect, use, and protect your personal information</p>
        <p className="text-sm text-muted-foreground mt-1">Last updated: September 30, 2024</p>
      </div>

      <div className="w-full gap-8">

        {/* Right Column - Policy Content */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-light text-foreground">
                  Privacy Policy Details
                </CardTitle>
                <p className="text-sm text-muted-foreground font-light">
                  comprehensive information about how we handle your data
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {privacySections.map((section, index) => (
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
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Legal Notice</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-light">
                      This policy will be refined and reviewed with legal counsel before final implementation. 
                      We are committed to maintaining the highest standards of privacy protection.
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

export default PrivacyPolicy;