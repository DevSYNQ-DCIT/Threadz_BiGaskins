import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Clear error when user starts typing
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9\s-]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.service) newErrors.service = 'Please select a service';
        if (!formData.message.trim()) newErrors.message = 'Please enter your message';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            // Here you would typically send the form data to your backend
            console.log('Form submitted:', formData);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    service: '',
                    message: ''
                });
                // Show success message
                alert('Thank you! Your consultation request has been submitted successfully.');
            }, 1000);
        } else {
            // Scroll to the first error
            const firstError = Object.keys(errors)[0];
            if (firstError) {
                document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const contactInfo = [
        {
            icon: <MapPin className="w-5 h-5" />,
            title: "Visit Our Studio",
            details: [" Adenta Housing", "Christ Apostolic Church"],
        },
        {
            icon: <Phone className="w-5 h-5" />,
            title: "Call Us",
            details: ["0544701851", "0248167891"],
        },
        {
            icon: <Mail className="w-5 h-5" />,
            title: "Email Us",
            details: ["Threadzbigaskins@gmail.com", "support@threadzbigskins.com"],
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: "Studio Hours",
            details: ["Mon-Fri: 9AM-7PM", "Sat: 10AM-5PM", "Sun: By Appointment"],
        },
    ];

    return (
        <section id="contact" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Get in <span className="text-gradient">Touch</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ready to start your fashion journey? Contact us today to schedule
                        a consultation and bring your vision to life.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        {contactInfo.map((info, index) => (
                            <Card key={index} className="border-0 luxury-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-fashion-gradient rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">{info.title}</h3>
                                            {info.details.map((detail, idx) => (
                                                <p key={idx} className="text-sm text-muted-foreground">
                                                    {detail}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <Card className="border-0 luxury-shadow">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif">Schedule Your Consultation</CardTitle>
                                    {Object.keys(errors).length > 0 && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Please fill in all required fields.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input 
                                                id="firstName" 
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter your first name" 
                                                className={errors.firstName ? 'border-destructive' : ''}
                                            />
                                            {errors.firstName && (
                                                <p className="text-sm text-destructive mt-1 flex items-center">
                                                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                    {errors.firstName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input 
                                                id="lastName" 
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter your last name" 
                                                className={errors.lastName ? 'border-destructive' : ''}
                                            />
                                            {errors.lastName && (
                                                <p className="text-sm text-destructive mt-1 flex items-center">
                                                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                    {errors.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email" 
                                                className={errors.email ? 'border-destructive' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-destructive mt-1 flex items-center">
                                                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone *</Label>
                                            <Input 
                                                id="phone" 
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number" 
                                                className={errors.phone ? 'border-destructive' : ''}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-destructive mt-1 flex items-center">
                                                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service">Service Interest *</Label>
                                        <select
                                            id="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border ${errors.service ? 'border-destructive' : 'border-input'} rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent`}
                                        >
                                            <option value="">Select a service</option>
                                            <option value="Custom Couture">Custom Couture</option>
                                            <option value="Design Consultation">Design Consultation</option>
                                            <option value="Alterations & Repairs">Alterations & Repairs</option>
                                            <option value="Bridal Couture">Bridal Couture</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.service && (
                                            <p className="text-sm text-destructive mt-1 flex items-center">
                                                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                {errors.service}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us about your project or requirements..."
                                            className={`min-h-[120px] ${errors.message ? 'border-destructive' : ''}`}
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-destructive mt-1 flex items-center">
                                                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-center w-full pt-4">
                                        <Button 
                                            type="submit"
                                            variant="luxury" 
                                            className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] px-4 sm:px-6 md:px-8 py-6 sm:py-4 text-sm sm:text-base"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Schedule Consultation'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;