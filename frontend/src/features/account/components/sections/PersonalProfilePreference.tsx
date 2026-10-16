import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { PersonalInformation } from '../types';
import { useIsMobile } from "@/hooks/use-mobile";

interface PersonalProfilePreferenceProps {
  onBack: () => void;
}

const PersonalProfilePreference: React.FC<PersonalProfilePreferenceProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
    firstName: 'Walid',
    lastName: 'Elmouahidi',
    nickname: 'Walid',
    email: 'walid.elmouahidi@example.com',
    phone: '+44 7123 456789',
    dateOfBirth: '1995-06-15',
    gender: 'male',
    city: 'London',
    country: 'United Kingdom',
    bio: 'Passionate about fashion and technology. Love exploring new styles and trends.'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Personal information updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const handleInputChange = (field: keyof PersonalInformation, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white pb-[20vh] max-w-screen-xl mx-auto overflow-y-auto">
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
          <h1 className="text-2xl text-black font-manrope lowercase tracking-wide">
            Personal Information
          </h1>
        </div>

        <div className="max-w-md mx-auto w-full px-4">
          {/* Profile Overview Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pb-6"
          >
            <Card className="border border-black rounded-none">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-light text-foreground">
                    Profile Overview
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <X className="mr-2 h-4 w-4" />
                    ) : (
                      <Edit2 className="mr-2 h-4 w-4" />
                    )}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-4 pb-4 border-b border-black">
                  <div className="h-16 w-16 rounded-none bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                    {personalInfo.firstName[0]}{personalInfo.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {personalInfo.firstName} {personalInfo.lastName}
                    </h3>
                    {personalInfo.nickname && (
                      <p className="text-sm text-muted-foreground">
                        "{personalInfo.nickname}"
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {personalInfo.city}, {personalInfo.country}
                    </p>
                  </div>
                </div>

                {/* Personal Details Display/Edit */}
                {isEditing ? (
                  <EditPersonalInfoForm
                    personalInfo={personalInfo}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : (
                  <PersonalInfoDisplay personalInfo={personalInfo} />
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
    <div className="py-8 max-w-4xl md:max-w-full">
      <div className="mb-3 px-5">
        <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
          Personal Information
        </h1>
        <p className="text-gray-600">Manage your personal details and account information</p>
      </div>

      <div className="max-w-2xl md:max-w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-l-0 border-black rounded-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-light text-foreground">
                  Profile Overview
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-8 h-12 rounded-full bg-[#303A2FB2] text-white font-light lowercase text-base"
                >
                  {isEditing ? (
                    <X className="mr-2 h-4 w-4" />
                  ) : (
                    <Edit2 className="mr-2 h-4 w-4" />
                  )}
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex px-5 items-center space-x-6 pb-6 border-b border-black">
                <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
                  {personalInfo.firstName[0]}{personalInfo.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-foreground">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h3>
                  {personalInfo.nickname && (
                    <p className="text-muted-foreground">
                      "{personalInfo.nickname}"
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    {personalInfo.city}, {personalInfo.country}
                  </p>
                </div>
              </div>

              {/* Personal Details Display/Edit */}
              {isEditing ? (
                <EditPersonalInfoForm
                  personalInfo={personalInfo}
                  onInputChange={handleInputChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <PersonalInfoDisplay personalInfo={personalInfo} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Display Component
interface PersonalInfoDisplayProps {
  personalInfo: PersonalInformation;
}

const PersonalInfoDisplay: React.FC<PersonalInfoDisplayProps> = ({ personalInfo }) => {
  return (
    <div className="space-y-4">
      <InfoItem label="First Name" value={personalInfo.firstName} />
      <InfoItem label="Last Name" value={personalInfo.lastName} />
      {personalInfo.nickname && (
        <InfoItem label="Nickname" value={personalInfo.nickname} />
      )}
      <InfoItem label="Email" value={personalInfo.email} />
      {personalInfo.phone && (
        <InfoItem label="Phone" value={personalInfo.phone} />
      )}
      {personalInfo.dateOfBirth && (
        <InfoItem 
          label="Date of Birth" 
          value={new Date(personalInfo.dateOfBirth).toLocaleDateString()} 
        />
      )}
      <InfoItem 
        label="Gender" 
        value={personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1).replace('-', ' ')} 
      />
      {personalInfo.address && (
        <InfoItem label="Address" value={personalInfo.address} />
      )}
      <InfoItem label="City" value={personalInfo.city} />
      <InfoItem label="Country" value={personalInfo.country} />
      {personalInfo.postalCode && (
        <InfoItem label="Postal Code" value={personalInfo.postalCode} />
      )}
      {personalInfo.bio && (
        <InfoItem label="Bio" value={personalInfo.bio} />
      )}
    </div>
  );
};

// Edit Form Component
interface EditPersonalInfoFormProps {
  personalInfo: PersonalInformation;
  onInputChange: (field: keyof PersonalInformation, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditPersonalInfoForm: React.FC<EditPersonalInfoFormProps> = ({ 
  personalInfo, 
  onInputChange, 
  onSave, 
  onCancel 
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      className="space-y-4 px-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="nickname" className="text-sm font-medium text-foreground">
          Nickname
        </Label>
        <Input
          id="nickname"
          value={personalInfo.nickname || ''}
          onChange={(e) => onInputChange('nickname', e.target.value)}
          className="mt-1"
          placeholder="Optional"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={personalInfo.phone || ''}
          onChange={(e) => onInputChange('phone', e.target.value)}
          className="mt-1"
          placeholder="Optional"
        />
      </div>

      <div>
        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
          Date of Birth
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={personalInfo.dateOfBirth || ''}
          onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="gender" className="text-sm font-medium text-foreground">
          Gender
        </Label>
        <Select
          value={personalInfo.gender}
          onValueChange={(value) => onInputChange('gender', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="text-sm font-medium text-foreground">
            City *
          </Label>
          <Input
            id="city"
            value={personalInfo.city}
            onChange={(e) => onInputChange('city', e.target.value)}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country" className="text-sm font-medium text-foreground">
          Country *
        </Label>
        <Input
          id="country"
          value={personalInfo.country}
          onChange={(e) => onInputChange('country', e.target.value)}
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="bio" className="text-sm font-medium text-foreground">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={personalInfo.bio || ''}
          onChange={(e) => onInputChange('bio', e.target.value)}
          className="mt-1"
          placeholder="Tell us about yourself (optional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button onClick={onSave} className="px-8 h-12 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="px-8 h-12 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase text-base">
          Cancel
        </Button>
      </div>
    </motion.div>
  );
};

// Helper Component for displaying info items
interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between px-5 items-start pb-4 border-b border-black last:border-b-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
};

export default PersonalProfilePreference;