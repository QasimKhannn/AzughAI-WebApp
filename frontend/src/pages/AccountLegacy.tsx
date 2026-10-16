import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard, Settings, LogOut, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import PageLayout from '@/layout/PageLayout';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

const Account: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Rayan',
    email: 'rayan@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Street',
    city: 'New York',
    country: 'United States'
  });

  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    pushNotifications: true,
    orderUpdates: true,
    styleRecommendations: true
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast("Profile updated successfully!");
  };

  const handleLogout = () => {
    toast("Redirecting to home...");
    // Redirect to home instead of auth
    window.location.href = "/home";
  };

  return (
    <PageLayout className="bg-white">
      {/* Remove dark overlay */}
      <main className="relative z-10 w-full h-full flex flex-col items-center overflow-auto pt-[12vh] pb-[20vh]">
        <div className="w-full max-w-md mx-auto px-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-manrope text-[#292929] font-semibold tracking-wide">ACCOUNT</h1>
              <p className="text-[#4E2B25]/70 font-manrope text-sm">Manage your profile and preferences</p>
            </div>

            {/* Profile Section */}
            <Card className="bg-white border-[#DED8D4] border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-[#4E2B25] font-manrope text-lg">Profile Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-[#DED8D4] text-[#4E2B25] hover:bg-[#DED8D4] hover:text-[#292929] transition-all"
                >
                  <Edit2 size={14} className="mr-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#292929] text-sm">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      disabled={!isEditing}
                      className="bg-[#F8F6F4] border-[#DED8D4] text-[#292929] placeholder:text-[#4E2B25]/40 focus:border-[#4E2B25] focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#292929] text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      disabled={!isEditing}
                      className="bg-[#F8F6F4] border-[#DED8D4] text-[#292929] placeholder:text-[#4E2B25]/40 focus:border-[#4E2B25] focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#292929] text-sm">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                      className="bg-[#F8F6F4] border-[#DED8D4] text-[#292929] placeholder:text-[#4E2B25]/40 focus:border-[#4E2B25] focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#292929] text-sm">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      disabled={!isEditing}
                      className="bg-[#F8F6F4] border-[#DED8D4] text-[#292929] placeholder:text-[#4E2B25]/40 focus:border-[#4E2B25] focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#292929] text-sm">City</Label>
                      <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => setProfile({...profile, city: e.target.value})}
                        disabled={!isEditing}
                        className="bg-[#F8F6F4] border-[#DED8D4] text-[#292929] placeholder:text-[#4E2B25]/40 focus:border-[#4E2B25] focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-[#292929] text-sm">Country</Label>
                      <Input
                        id="country"
                        value={profile.country}
                        onChange={(e) => setProfile({...profile, country: e.target.value})}
                        disabled={!isEditing}
                        className="bg-[#F8F6F4] border-[#DED8D4] text-[#292929] placeholder:text-[#4E2B25]/40 focus:border-[#4E2B25] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleSaveProfile}
                      className="flex-1 bg-[#4E2B25] hover:bg-[#DED8D4] hover:text-[#292929] text-white font-semibold"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border-[#DED8D4] text-[#4E2B25] hover:bg-[#DED8D4] hover:text-[#292929]"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white border-[#DED8D4] border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#4E2B25] font-manrope text-lg">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[#292929] text-sm">Email Marketing</Label>
                    <p className="text-xs text-[#4E2B25]/60">Receive promotional emails and newsletters</p>
                  </div>
                  <Switch
                    checked={notifications.emailMarketing}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailMarketing: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[#292929] text-sm">Push Notifications</Label>
                    <p className="text-xs text-[#4E2B25]/60">Get notified about new arrivals and sales</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[#292929] text-sm">Order Updates</Label>
                    <p className="text-xs text-[#4E2B25]/60">Shipping and delivery notifications</p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[#292929] text-sm">Style Recommendations</Label>
                    <p className="text-xs text-[#4E2B25]/60">Personalized styling suggestions</p>
                  </div>
                  <Switch
                    checked={notifications.styleRecommendations}
                    onCheckedChange={(checked) => setNotifications({...notifications, styleRecommendations: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-[#DED8D4] border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#4E2B25] font-manrope text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-[#4E2B25] hover:bg-[#DED8D4]/30 hover:text-[#292929] transition-all"
                  onClick={() => window.location.href = '/take-quiz'}
                >
                  <Settings size={16} className="mr-3" />
                  Retake Style Quiz
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-[#4E2B25] hover:bg-[#DED8D4]/30 hover:text-[#292929] transition-all"
                  onClick={() => window.location.href = '/cart'}
                >
                  <CreditCard size={16} className="mr-3" />
                  Payment Methods
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-[#4E2B25] hover:bg-[#DED8D4]/30 hover:text-[#292929] transition-all"
                  onClick={() => toast("Opening order history...")}
                >
                  <MapPin size={16} className="mr-3" />
                  Order History
                </Button>
                <hr className="border-[#DED8D4] my-3" />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-700 transition-all"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-3" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-white border-[#DED8D4] border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#4E2B25] font-manrope text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-[#4E2B25]">12</div>
                    <div className="text-xs text-[#292929]/60">Items in Closet</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-[#4E2B25]">5</div>
                    <div className="text-xs text-[#292929]/60">Items in Wishlist</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-[#4E2B25]">3</div>
                    <div className="text-xs text-[#292929]/60">Orders This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Account;
