import { supabase } from '../supabase';

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  marketing: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

export const getUserPreferences = async (userId: string): Promise<NotificationPreferences> => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('notification_preferences')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
    console.error('Error fetching user preferences:', error);
    throw error;
  }

  // Return default preferences if no preferences exist
  if (!data) {
    return {
      email: true,
      inApp: true,
      marketing: true,
      orderUpdates: true,
      promotions: true,
    };
  }

  return data.notification_preferences as NotificationPreferences;
};

export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  // First get existing preferences
  const existingPrefs = await getUserPreferences(userId);

  // Merge with new preferences
  const updatedPrefs = { ...existingPrefs, ...preferences };

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      notification_preferences: updatedPrefs,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
      returning: 'representation',
    })
    .select('notification_preferences')
    .single();

  if (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }

  return data.notification_preferences as NotificationPreferences;
};
