import React from 'react';
import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from './types';

interface UserInfoCardProps {
  userProfile: UserProfile;
  isEditingProfile: boolean;
  onEditToggle: () => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  userProfile,
  isEditingProfile,
  onEditToggle,
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border border-l-0 border-black rounded-none">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
              {userProfile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {userProfile.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {userProfile.email}
              </p>
            </div>
          </div>
          {/* <Button
            onClick={onEditToggle}
            variant="outline"
            className="w-full mt-4"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            {isEditingProfile ? "Cancel" : "Edit Profile"}
          </Button> */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserInfoCard;
