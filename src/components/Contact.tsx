import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
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
                        <Card className="border-0 luxury-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl font-serif">Schedule Your Consultation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="Enter your first name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Enter your last name" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="Enter your email" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" placeholder="Enter your phone number" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="service">Service Interest</Label>
                                    <select
                                        id="service"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                                    >
                                        <option>Select a service</option>
                                        <option>Custom Couture</option>
                                        <option>Design Consultation</option>
                                        <option>Alterations & Repairs</option>
                                        <option>Bridal Couture</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us about your project or requirements..."
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="flex justify-center">
                                    <Button variant="luxury" size="lg" className="w-full sm:w-auto px-8">
                                        Schedule Consultation
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;