import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, MessageSquare, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { SupportRequest } from '../types';
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactSupportProps {
  onBack: () => void;
}

const ContactSupport: React.FC<ContactSupportProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [supportRequest, setSupportRequest] = useState<SupportRequest>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    { value: 'technical', label: 'technical issue' },
    { value: 'billing', label: 'billing & payments' },
    { value: 'account', label: 'account settings' },
    { value: 'styling', label: 'styling & recommendations' },
    { value: 'bug', label: 'bug report' },
    { value: 'feature', label: 'feature request' },
    { value: 'other', label: 'other' }
  ];

  const handleInputChange = (field: keyof SupportRequest, value: string) => {
    setSupportRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!supportRequest.name || !supportRequest.email || !supportRequest.subject || !supportRequest.message || !selectedCategory) {
      toast.error("please fill in all required fields");
      return;
    }

    // Here you would typically send the support request to your backend
    console.log('Support request:', { ...supportRequest, category: selectedCategory });
    
    // Reset form
    setSupportRequest({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setSelectedCategory('');
    
    toast.success("support request sent successfully! we'll get back to you within 24 hours.");
  };

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
            contact support
          </h1>
        </div>

        <div className="max-w-md mx-auto w-full px-4 space-y-6">
          {/* Contact Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      get in touch
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      we're here to help you with any questions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    name *
                  </Label>
                  <Input
                    id="name"
                    value={supportRequest.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 font-light"
                    placeholder="your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={supportRequest.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 font-light"
                    placeholder="your email address"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-foreground">
                    category *
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value} className="font-light">
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                    subject *
                  </Label>
                  <Input
                    id="subject"
                    value={supportRequest.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="mt-1 font-light"
                    placeholder="brief description of your issue"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    message *
                  </Label>
                  <Textarea
                    id="message"
                    value={supportRequest.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="mt-1 font-light"
                    placeholder="please provide detailed information about your issue or question..."
                    rows={5}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
                >
                  <Send className="mr-2 h-4 w-4" />
                  send message
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Time Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border rounded-none">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-light">
                    we typically respond within <span className="font-medium">24 hours</span>
                  </p>
                  <p className="text-xs text-muted-foreground font-light mt-1">
                    for urgent issues, please include "urgent" in your subject line
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
          Contact Support
        </h1>
        <p className="text-gray-600">Get help from our support team - we're here to assist you</p>
      </div>

      <div className="w-full gap-8">

        {/* Right Column - Contact Form */}
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
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      send us a message
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      fill out the form below and we'll get back to you soon
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      name *
                    </Label>
                    <Input
                      id="name"
                      value={supportRequest.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1 font-light"
                      placeholder="your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={supportRequest.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 font-light"
                      placeholder="your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-foreground">
                      category *
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="font-light">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                      subject *
                    </Label>
                    <Input
                      id="subject"
                      value={supportRequest.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="mt-1 font-light"
                      placeholder="brief description of your issue"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    message *
                  </Label>
                  <Textarea
                    id="message"
                    value={supportRequest.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="mt-1 font-light"
                    placeholder="please provide detailed information about your issue or question..."
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base"
                >
                  <Send className="mr-2 h-4 w-4" />
                  send message
                </Button>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-light">
                      We typically respond within <span className="font-medium">24 hours</span>. 
                      For urgent issues, please include "urgent" in your subject line.
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

export default ContactSupport;