import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationPreferences, getUserPreferences, updateUserPreferences } from '@/lib/api/userPreferences';

export function NotificationPreferencesModal({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    inApp: true,
    marketing: true,
    orderUpdates: true,
    promotions: true,
  });

  // Load user preferences when modal opens
  useEffect(() => {
    const loadPreferences = async () => {
      if (isOpen && user?.id) {
        try {
          setIsLoading(true);
          const prefs = await getUserPreferences(user.id);
          setPreferences(prefs);
        } catch (error) {
          console.error('Failed to load preferences:', error);
          toast({
            title: 'Error',
            description: 'Failed to load notification preferences',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPreferences();
  }, [isOpen, user?.id]);

  const handleSave = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update preferences',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateUserPreferences(user.id, preferences);
      
      toast({
        title: 'Preferences saved!',
        description: 'Your notification preferences have been updated.',
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [preferences, user?.id]);

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to receive notifications from us.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.email}
                onCheckedChange={() => togglePreference('email')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications in the app</p>
              </div>
              <Switch
                id="in-app-notifications"
                checked={preferences.inApp}
                onCheckedChange={() => togglePreference('inApp')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-notifications">Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">Receive marketing emails and updates</p>
              </div>
              <Switch
                id="marketing-notifications"
                checked={preferences.marketing}
                onCheckedChange={() => togglePreference('marketing')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="order-updates">Order Updates</Label>
                <p className="text-sm text-muted-foreground">Get updates about your orders</p>
              </div>
              <Switch
                id="order-updates"
                checked={preferences.orderUpdates}
                onCheckedChange={() => togglePreference('orderUpdates')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="promotions">Promotions & Offers</Label>
                <p className="text-sm text-muted-foreground">Receive special offers and discounts</p>
              </div>
              <Switch
                id="promotions"
                checked={preferences.promotions}
                onCheckedChange={() => togglePreference('promotions')}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
