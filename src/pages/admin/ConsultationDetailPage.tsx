import { useParams, useNavigate } from 'react-router-dom';
import { useConsultations } from '@/contexts/ConsultationsContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar, Clock, User, Mail, Phone, ArrowLeft, Save, Pencil, Ruler, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusMap = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function ConsultationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getConsultationById, updateConsultationStatus, addConsultationNotes } = useConsultations();

  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    const loadConsultation = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getConsultationById(id);
          if (data) {
            setConsultation(data);
            setNotes(data.notes || '');
          }
        }
      } catch (error) {
        console.error('Error loading consultation:', error);
        toast({
          title: 'Error',
          description: 'Failed to load consultation details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadConsultation();
  }, [id, getConsultationById, toast]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;

    try {
      setSaving(true);
      await updateConsultationStatus(id, newStatus);
      setConsultation((prev: any) => ({
        ...prev,
        status: newStatus,
        ...(newStatus === 'completed' && { completed_at: new Date().toISOString() }),
        ...(newStatus === 'cancelled' && { cancelled_at: new Date().toISOString() }),
      }));

      toast({
        title: 'Success',
        description: 'Consultation status updated successfully.',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update consultation status.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!id || !notes) return;

    try {
      setSaving(true);
      await addConsultationNotes(id, notes);
      setConsultation((prev: any) => ({
        ...prev,
        notes,
      }));
      setIsEditingNotes(false);

      toast({
        title: 'Success',
        description: 'Notes saved successfully.',
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Consultation not found</h3>
        <p className="text-muted-foreground mt-2">The requested consultation could not be found.</p>
        <Button className="mt-4" onClick={() => navigate('/admin/consultations')}>
          Back to Consultations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/consultations')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Consultation Details</h2>
          <p className="text-muted-foreground">
            View and manage this consultation
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Customer Information</CardTitle>
                <Badge className={statusMap[consultation.status as keyof typeof statusMap]?.color}>
                  {statusMap[consultation.status as keyof typeof statusMap]?.label || consultation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{consultation.user?.full_name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{consultation.user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${consultation.user?.email}`}
                      className="text-sm hover:underline"
                    >
                      {consultation.user?.email || 'N/A'}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{consultation.user?.phone_number || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Consultation Type</p>
                  <p className="capitalize">{consultation.type?.replace('_', ' ') || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Preferred Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {consultation.preferred_date
                        ? format(new Date(consultation.preferred_date), 'MMMM d, yyyy')
                        : 'Not specified'}
                    </span>
                  </div>
                </div>
                {consultation.preferred_time_slot && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Preferred Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{consultation.preferred_time_slot}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Select
                    value={consultation.status}
                    onValueChange={handleStatusChange}
                    disabled={saving}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusMap).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {consultation.measurements && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Measurements</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(consultation.measurements, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Notes</h3>
                  </div>
                  {!isEditingNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingNotes(true)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Notes
                    </Button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this consultation..."
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingNotes(false);
                          setNotes(consultation.notes || '');
                        }}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveNotes} disabled={saving || !notes.trim()}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Notes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[120px] p-4 bg-gray-50 rounded-md">
                    {consultation.notes ? (
                      <p className="whitespace-pre-wrap">{consultation.notes}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No notes added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline / Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Consultation activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">Consultation Created</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(consultation.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                {consultation.completed_at && (
                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 mt-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium">Marked as Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(consultation.completed_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                )}

                {consultation.cancelled_at && (
                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 mt-2 rounded-full bg-red-500"></div>
                    <div>
                      <p className="font-medium">Cancelled</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(consultation.cancelled_at), 'MMM d, yyyy h:mm a')}
                        {consultation.cancellation_reason && (
                          <span className="block mt-1">
                            <span className="font-medium">Reason:</span> {consultation.cancellation_reason}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" disabled={saving}>
                Send Message
              </Button>
              <Button variant="outline" className="w-full" disabled={saving}>
                Reschedule
              </Button>
              {consultation.status !== 'cancelled' && (
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={saving}
                >
                  Cancel Consultation
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
