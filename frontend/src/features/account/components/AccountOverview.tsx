import React from "react";
import UserInfoCard from "./UserInfoCard";
import EditProfileForm from "./EditProfileForm";
import { UserProfile } from "./types";
import { Button } from "@/components/ui/button";

interface AccountOverviewProps {
  userProfile: UserProfile;
  isEditingProfile: boolean;
  onEditToggle: () => void;
  onProfileChange: (profile: UserProfile) => void;
  onSave: () => void;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({
  userProfile,
  isEditingProfile,
  onEditToggle,
  onProfileChange,
  onSave,
}) => (
  <div className="py-8">
    <div className="max-w-2xl md:max-w-full">
      <h1 className="text-3xl px-5 font-manrope lowercase tracking-wide text-black mb-4">
        Account Overview
      </h1>
      {/* User Info Card for Desktop */}
      <div className="mb-8">
        <UserInfoCard
          userProfile={userProfile}
          isEditingProfile={isEditingProfile}
          onEditToggle={onEditToggle}
        />
      </div>
      {/* Edit Profile Form for Desktop */}
      <EditProfileForm
        userProfile={userProfile}
        onProfileChange={onProfileChange}
        onSave={onSave}
        isVisible={isEditingProfile}
      />
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-4 px-5">
          Welcome to your account dashboard. Use the navigation menu on the left to access different sections of your account settings.
        </p>
        <div className="grid grid-cols-2 mt-6">
          <div className="p-4 border border-l-0 border-black">
            <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
            <p className="text-sm text-gray-600">Account created: March 2024</p>
            <p className="text-sm text-gray-600">Last login: Today</p>
          </div>
          <div className="p-4 border border-l-0 border-black">
            <h3 className="font-medium text-gray-900 mb-2">Subscription</h3>
            <p className="text-sm text-gray-600">Premium Plan</p>
            <p className="text-sm text-gray-600">Next billing: Apr 15, 2024</p>
          </div>
        </div>
        <div className="mt-8 p-4">
          <Button
            variant="outline-dark"
            onClick={onEditToggle}
            className="text-red border-red"
          >
            delete account
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default AccountOverview;