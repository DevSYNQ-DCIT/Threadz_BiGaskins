import { supabase } from './supabase';
import { Database } from '@/types/supabase';

type Consultation = Database['public']['Tables']['consultations']['Row'];
type ConsultationInsert = Database['public']['Tables']['consultations']['Insert'];
type ConsultationUpdate = Database['public']['Tables']['consultations']['Update'];

export const consultationsService = {
  // Fetch all consultations with user details
  getConsultations: async (): Promise<(Consultation & { user: { full_name: string, email: string } | null })[]> => {
    // First get all consultations
    const { data: consultations, error: consultationsError } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });

    if (consultationsError) {
      console.error('Error fetching consultations:', consultationsError);
      throw consultationsError;
    }

    if (!consultations || consultations.length === 0) return [];

    // Then get all user IDs to fetch in a single query
    const userIds = consultations
      .map(c => c.user_id)
      .filter((id, index, self) => id && self.indexOf(id) === index);

    // Fetch all users in a single query
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, email')
      .in('id', userIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      // Don't throw, just return consultations without user data
      return consultations.map(consultation => ({
        ...consultation,
        user: null
      }));
    }

    // Create a map of user ID to user data for quick lookup
    const userMap = new Map(users?.map(user => [user.id, user]) || []);

    // Combine the data
    return consultations.map(consultation => ({
      ...consultation,
      user: userMap.get(consultation.user_id) || null
    }));
  },

  // Get a single consultation by ID with user details
  getConsultationById: async (id: string): Promise<(Consultation & { user: { full_name: string, email: string } | null }) | null> => {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        user:user_id (id, full_name, email, phone_number)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching consultation:', error);
      throw error;
    }

    return data;
  },

  // Get consultation measurements
  getConsultationMeasurements: async (consultationId: string) => {
    const { data, error } = await supabase
      .from('consultation_measurements')
      .select('*')
      .eq('consultation_id', consultationId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore not found
      console.error('Error fetching measurements:', error);
      throw error;
    }

    return data;
  },

  // Update consultation status
  updateConsultationStatus: async (id: string, status: string, assignedTo?: string): Promise<Consultation> => {
    const updates: any = { status, updated_at: new Date().toISOString() };

    if (assignedTo) {
      updates.assigned_to = assignedTo;
    }

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updates.cancelled_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('consultations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating consultation:', error);
      throw error;
    }

    return data;
  },

  // Add notes to consultation
  addConsultationNotes: async (id: string, notes: string): Promise<Consultation> => {
    const { data, error } = await supabase
      .from('consultations')
      .update({
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating consultation notes:', error);
      throw error;
    }

    return data;
  },

  // Subscribe to consultation changes
  subscribeToConsultations: (
    callback: (payload: {
      eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      new: Consultation | null;
      old: Consultation | null;
    }) => void
  ) => {
    const subscription = supabase
      .channel('consultations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultations',
        },
        (payload) => {
          callback({
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            new: payload.new as Consultation | null,
            old: payload.old as Consultation | null,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },
};

export default consultationsService;
