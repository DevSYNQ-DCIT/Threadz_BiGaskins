import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { z } from 'zod';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().optional(),
  date: z.date({
    required_error: 'Please select a date',
    invalid_type_error: "That's not a valid date!",
  })
});

type FormData = z.infer<typeof formSchema> & { date: Date };

interface ConsultationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ConsultationForm({ isOpen, onClose, onSuccess }: ConsultationFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Reset form when opening/closing
  useEffect(() => {
    if (!isOpen) {
      // Reset form state after animation completes
      const timer = setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
        setDate(new Date());
        setErrors({});
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    try {
      formSchema.parse({
        ...formData,
        date: date || undefined
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        
        // Scroll to first error
        const firstError = document.querySelector('[data-error="true"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!date) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', { ...formData, date });
      setIsSuccess(true);
      toast.success('Consultation booked successfully!');
      
      // Reset form after success
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to book consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div 
        ref={formRef}
        className={cn(
          'bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative shadow-xl transform transition-all duration-300',
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full p-1"
          aria-label="Close form"
          disabled={isSubmitting}
        >
          <XCircle className="h-6 w-6" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your consultation request has been received. We'll be in touch soon.</p>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-serif font-bold mb-6">Book a Consultation</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name {errors.name && <span className="text-red-500 text-xs">*</span>}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={errors.name ? 'border-red-500' : ''}
                  data-error={!!errors.name}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email {errors.email && <span className="text-red-500 text-xs">*</span>}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                    data-error={!!errors.email}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone {errors.phone && <span className="text-red-500 text-xs">*</span>}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className={errors.phone ? 'border-red-500' : ''}
                    data-error={!!errors.phone}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-1">
                  Service Interest {errors.service && <span className="text-red-500 text-xs">*</span>}
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.service ? 'border-red-500' : ''
                  )}
                  data-error={!!errors.service}
                  disabled={isSubmitting}
                >
                  <option value="">Select a service</option>
                  <option value="custom-dress">Custom Dress Design</option>
                  <option value="wardrobe-consult">Wardrobe Consultation</option>
                  <option value="special-occasion">Special Occasion</option>
                  <option value="alterations">Alterations</option>
                  <option value="other">Other</option>
                </select>
                {errors.service && (
                  <p className="mt-1 text-sm text-red-600">{errors.service}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred Date {!date && errors.date && <span className="text-red-500 text-xs">*</span>}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date ? 'border-red-500' : ''
                      )}
                      disabled={isSubmitting}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => isBefore(date, new Date())}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Tell us about your project
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details about what you're looking for..."
                  className="min-h-[120px]"
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="gold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Schedule Consultation'
                  )}
                </Button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  We'll contact you within 24 hours to confirm your appointment.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
