import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { consultationsService } from '@/lib/consultations';

type ConsultationWithUser = Awaited<ReturnType<typeof consultationsService.getConsultations>>[number];

type ConsultationsContextType = {
  consultations: ConsultationWithUser[];
  loading: boolean;
  error: string | null;
  refreshConsultations: () => Promise<void>;
  updateConsultationStatus: (id: string, status: string, assignedTo?: string) => Promise<void>;
  addConsultationNotes: (id: string, notes: string) => Promise<void>;
  getConsultationById: (id: string) => Promise<ConsultationWithUser | null>;
};

const ConsultationsContext = createContext<ConsultationsContextType | undefined>(undefined);

export const ConsultationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<ConsultationWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await consultationsService.getConsultations();
      setConsultations(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch consultations:', err);
      setError('Failed to load consultations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConsultations();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubscribe = consultationsService.subscribeToConsultations(
      ({ eventType, new: newConsultation, old: oldConsultation }) => {
        switch (eventType) {
          case 'INSERT':
            if (newConsultation) {
              // We'll fetch the full consultation with user details
              fetchConsultations();
            }
            break;
          case 'UPDATE':
            setConsultations(prev =>
              prev.map(consultation =>
                consultation.id === newConsultation?.id
                  ? { ...consultation, ...newConsultation }
                  : consultation
              )
            );
            break;
          case 'DELETE':
            if (oldConsultation) {
              setConsultations(prev =>
                prev.filter(consultation => consultation.id !== oldConsultation.id)
              );
            }
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const updateConsultationStatus = async (id: string, status: string, assignedTo?: string) => {
    try {
      await consultationsService.updateConsultationStatus(id, status, assignedTo);
      // The subscription will handle the update
    } catch (error) {
      console.error('Error updating consultation status:', error);
      throw error;
    }
  };

  const addConsultationNotes = async (id: string, notes: string) => {
    try {
      await consultationsService.addConsultationNotes(id, notes);
      // The subscription will handle the update
    } catch (error) {
      console.error('Error adding consultation notes:', error);
      throw error;
    }
  };

  const getConsultationById = async (id: string) => {
    try {
      return await consultationsService.getConsultationById(id);
    } catch (error) {
      console.error('Error fetching consultation:', error);
      throw error;
    }
  };

  return (
    <ConsultationsContext.Provider
      value={{
        consultations,
        loading,
        error,
        refreshConsultations: fetchConsultations,
        updateConsultationStatus,
        addConsultationNotes,
        getConsultationById,
      }}
    >
      {children}
    </ConsultationsContext.Provider>
  );
};

export const useConsultations = (): ConsultationsContextType => {
  const context = useContext(ConsultationsContext);
  if (context === undefined) {
    throw new Error('useConsultations must be used within a ConsultationsProvider');
  }
  return context;
};

export default ConsultationsContext;
