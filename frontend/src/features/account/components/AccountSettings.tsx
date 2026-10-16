import React, { useState } from 'react';
import { User, Sparkles, CreditCard, Calendar, Shirt, HelpCircle, MessageSquare, Heart, FileText, Shield } from 'lucide-react';
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import UserInfoCard from './UserInfoCard';
import EditProfileForm from './EditProfileForm';
import MenuItem from './MenuItem';
import MenuSection from './MenuSection';
import PersonalProfilePreference from './sections/PersonalProfilePreference';
import AzughAiPreference from './sections/AzughAiPreference';
import AstheticsPreference from './sections/AstheticsPreference';
import PaymentPreference from './sections/PaymentPreference';
import PaymentHistory from './sections/PaymentHistory';
import HelpSection from './sections/HelpSection';
import ContactSupport from './sections/ContactSupport';
import GiveFeedback from './sections/GiveFeedback';
import TermsConditions from './sections/TermsConditions';
import PrivacyPolicy from './sections/PrivacyPolicy';
import AccountOverview from './AccountOverview';
import SubscriptionSection from './sections/Subscription';
import { UserProfile } from './types';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: 'main' | 'personal-info' | 'aesthetics' | 'azugh-ai' | 'payment' | 'subscription' | 'payment-history' | 'help' | 'contact-support' | 'give-feedback' | 'terms-conditions' | 'privacy-policy';
}

const navigationItems: NavigationItem[] = [
  { id: 'main', label: 'account overview', icon: <User className="h-5 w-5" />, section: 'main' },
  { id: 'personal-info', label: 'personal information', icon: <User className="h-5 w-5" />, section: 'personal-info' },
  { id: 'aesthetics', label: 'aesthetics & sizing', icon: <Shirt className="h-5 w-5" />, section: 'aesthetics' },
  { id: 'azugh-ai', label: 'azugh ai', icon: <Sparkles className="h-5 w-5" />, section: 'azugh-ai' },
  { id: 'payment', label: 'payment', icon: <CreditCard className="h-5 w-5" />, section: 'payment' },
  { id: 'subscription', label: 'subscriptions', icon: <Sparkles className="h-5 w-5" />, section: 'subscription' },
  { id: 'payment-history', label: 'payment history', icon: <Calendar className="h-5 w-5" />, section: 'payment-history' },
  { id: 'help', label: 'help', icon: <HelpCircle className="h-5 w-5" />, section: 'help' },
  { id: 'contact-support', label: 'contact support', icon: <MessageSquare className="h-5 w-5" />, section: 'contact-support' },
  { id: 'give-feedback', label: 'give feedback', icon: <Heart className="h-5 w-5" />, section: 'give-feedback' },
  { id: 'terms-conditions', label: 'terms & conditions', icon: <FileText className="h-5 w-5" />, section: 'terms-conditions' },
  { id: 'privacy-policy', label: 'privacy policy', icon: <Shield className="h-5 w-5" />, section: 'privacy-policy' },
];

const AccountSettings: React.FC = () => {
  const isMobile = useIsMobile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentSection, setCurrentSection] = useState<'main' | 'personal-info' | 'aesthetics' | 'azugh-ai' | 'payment' | 'subscription' | 'payment-history' | 'help' | 'contact-support' | 'give-feedback' | 'terms-conditions' | 'privacy-policy'>('main');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Walid Elmouahidi',
    email: 'walid.elmouahidi@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'London',
    country: 'United Kingdom'
  });

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  const handleMenuItemClick = (section: string) => {
    const navItem = navigationItems.find(item => item.label === section);
    if (navItem) {
      setCurrentSection(navItem.section);
    } else {
      toast.info(`${section} section coming soon!`);
    }
  };

  const handleNavItemClick = (section: NavigationItem['section']) => {
    setCurrentSection(section);
  };

  const handleBackToMain = () => {
    setCurrentSection('main');
  };

  // Mobile layout (existing functionality)
  if (isMobile) {
    // Render different sections based on currentSection
    if (currentSection === 'personal-info') {
      return <PersonalProfilePreference onBack={handleBackToMain} />;
    }

    if (currentSection === 'azugh-ai') {
      return <AzughAiPreference onBack={handleBackToMain} />;
    }

    if (currentSection === 'aesthetics') {
      return <AstheticsPreference onBack={handleBackToMain} />;
    }

    if (currentSection === 'payment') {
      return <PaymentPreference onBack={handleBackToMain} />;
    }

    if (currentSection === 'payment-history') {
      return <PaymentHistory onBack={handleBackToMain} />;
    }

    if (currentSection === 'subscription') {
      return <SubscriptionSection onBack={handleBackToMain} />;
    }

    if (currentSection === 'help') {
      return <HelpSection onBack={handleBackToMain} />;
    }

    if (currentSection === 'contact-support') {
      return <ContactSupport onBack={handleBackToMain} />;
    }

    if (currentSection === 'give-feedback') {
      return <GiveFeedback onBack={handleBackToMain} />;
    }

    if (currentSection === 'terms-conditions') {
      return <TermsConditions onBack={handleBackToMain} />;
    }

    if (currentSection === 'privacy-policy') {
      return <PrivacyPolicy onBack={handleBackToMain} />;
    }

    return (
      <div className="w-full min-h-screen flex flex-col pb-[20vh] max-w-screen-xl mx-auto overflow-y-auto bg-white">
        <div className={`flex justify-between items-center text-lg px-4 py-4`}>
          <h1 className="text-2xl text-black font-manrope lowercase tracking-wide">
            Account
          </h1>
        </div>
        <div className="max-w-md mx-auto w-full">
          {/* User Info Card */}
          <UserInfoCard
            userProfile={userProfile}
            isEditingProfile={isEditingProfile}
            onEditToggle={() => setIsEditingProfile(!isEditingProfile)}
          />

          {/* Edit Profile Form */}
          <EditProfileForm
            userProfile={userProfile}
            onProfileChange={setUserProfile}
            onSave={handleSaveProfile}
            isVisible={isEditingProfile}
          />

          {/* Menu Sections */}
          <div className="space-y-4 px-4 mt-4">
            {/* Account Section */}
            <MenuSection delay={0.2}>
              <MenuItem
                icon={<User className="h-5 w-5" />}
                text="personal information"
                onClick={() => handleMenuItemClick('personal information')}
              />
              
              <MenuItem
                icon={<Shirt className="h-5 w-5" />}
                text="aesthetics & sizing"
                onClick={() => handleMenuItemClick('aesthetics & sizing')}
              />
              
              <MenuItem
                icon={<Sparkles className="h-5 w-5" />}
                text="azugh ai"
                onClick={() => handleMenuItemClick('azugh ai')}
              />
              
              <MenuItem
                icon={<CreditCard className="h-5 w-5" />}
                text="payment"
                onClick={() => handleMenuItemClick('payment')}
              />

              <MenuItem
                icon={<Sparkles className="h-5 w-5" />}
                text="subscriptions"
                onClick={() => handleMenuItemClick('subscriptions')}
              />
              
              <MenuItem
                icon={<Calendar className="h-5 w-5" />}
                text="payment history"
                onClick={() => handleMenuItemClick('payment history')}
              />
            </MenuSection>

            {/* Support Section */}
            <MenuSection delay={0.3}>
              <MenuItem
                text="help"
                onClick={() => handleMenuItemClick('help')}
              />
              <MenuItem
                text="contact support"
                onClick={() => handleMenuItemClick('contact support')}
              />
              <MenuItem
                text="give feedback"
                onClick={() => handleMenuItemClick('give feedback')}
              />
            </MenuSection>

            <MenuSection delay={0.3}>
              <MenuItem
                text="terms & conditions"
                onClick={() => handleMenuItemClick('terms & conditions')}
              />
              <MenuItem
                text="privacy policy"
                onClick={() => handleMenuItemClick('privacy policy')}
              />
            </MenuSection>
          </div>
        </div>
      </div>
    );
  }

  // Desktop two-column layout
  const renderSectionContent = () => {
    switch (currentSection) {
      case 'personal-info':
        return <PersonalProfilePreference onBack={() => {}} />;
      case 'azugh-ai':
        return <AzughAiPreference onBack={() => {}} />;
      case 'aesthetics':
        return <AstheticsPreference onBack={() => {}} />;
      case 'payment':
        return <PaymentPreference onBack={() => {}} />;
      case 'payment-history':
        return <PaymentHistory onBack={() => {}} />;
      case 'subscription':
        return <SubscriptionSection onBack={() => {}} />;
      case 'help':
        return <HelpSection onBack={() => {}} />;
      case 'contact-support':
        return <ContactSupport onBack={() => {}} />;
      case 'give-feedback':
        return <GiveFeedback onBack={() => {}} />;
      case 'terms-conditions':
        return <TermsConditions onBack={() => {}} />;
      case 'privacy-policy':
        return <PrivacyPolicy onBack={() => {}} />;
      default:
        return (
          <AccountOverview
            userProfile={userProfile}
            isEditingProfile={isEditingProfile}
            onEditToggle={() => setIsEditingProfile(!isEditingProfile)}
            onProfileChange={setUserProfile}
            onSave={handleSaveProfile}
          />
        );
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto border-t border-black bg-white">
      {/* Header */}
      <div className="flex justify-between items-center text-lg px-6 py-6 border-b border-black">
        <h1 className="text-2xl text-black font-manrope lowercase tracking-wide">
          Account
        </h1>
      </div>
      
      {/* Two Column Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left Navigation Sidebar */}
        <div className="w-80 h-[88vh] mt-0 bg-white overflow-y-auto">
          <div className="">
            <nav className="space-y-0">
              {/* Navigation Items */}
              {navigationItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item.section)}
                  className={`w-full flex items-center px-3 py-4 text-sm text-left transition-colors border-b border-black ${
                    currentSection === item.section
                      ? 'bg-[#AA9C64]/10 text-[#AA9C64]'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${idx === navigationItems.length - 1 ? 'border-b-0' : ''}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto border-l border-black">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;