import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserProfile } from './types';

interface EditProfileFormProps {
  userProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onSave: () => void;
  isVisible: boolean;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  userProfile,
  onProfileChange,
  onSave,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="px-2 pb-6"
    >
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            Edit Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </Label>
              <Input
                id="name"
                value={userProfile.name}
                onChange={(e) =>
                  onProfileChange({ ...userProfile, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) =>
                  onProfileChange({
                    ...userProfile,
                    email: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                value={userProfile.phone}
                onChange={(e) =>
                  onProfileChange({
                    ...userProfile,
                    phone: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="address"
                className="text-sm font-medium text-foreground"
              >
                Address
              </Label>
              <Input
                id="address"
                value={userProfile.address}
                onChange={(e) =>
                  onProfileChange({
                    ...userProfile,
                    address: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={onSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditProfileForm;
