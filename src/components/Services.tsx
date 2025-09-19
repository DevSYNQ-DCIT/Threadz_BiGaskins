import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Scissors, Palette, Crown, Zap, Clock, Heart, X, Calendar, Check } from 'lucide-react';

interface Service {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
    price: string;
    details: string[];
}

const Services = () => {
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const services: Service[] = [
        {
            icon: <Crown className="w-5 h-5" />,
            title: "Custom Couture",
            description: "Bespoke garments tailored to your exact measurements and style preferences.",
            features: ["Personal consultation", "Premium fabrics", "Perfect fit guarantee"],
            price: "From ₵2,500",
            details: [
                "Initial consultation to discuss your vision and requirements",
                "Custom pattern making and fabric selection",
                "Multiple fittings to ensure perfect fit",
                "Hand-finished details and final adjustments"
            ]
        },
        {
            icon: <Palette className="w-5 h-5" />,
            title: "Design Consultation",
            description: "Professional styling advice and wardrobe planning for any occasion.",
            features: ["Style analysis", "Color coordination", "Wardrobe audit"],
            price: "From ₵500",
            details: [
                "Personalized style analysis",
                "Color palette creation",
                "Wardrobe audit and recommendations"
            ]
        },
        {
            icon: <Scissors className="w-5 h-5" />,
            title: "Alterations & Repairs",
            description: "Expert alterations to ensure your garments fit perfectly and last longer.",
            features: ["Precision fitting", "Quality repairs", "Quick turnaround"],
            price: "From ₵150",
            details: [
                "Expert alterations and repairs",
                "Quick turnaround time",
                "Quality guarantee"
            ]
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Express Service",
            description: "Rush orders for special events with our premium express service.",
            features: ["5-day delivery", "Priority booking", "Dedicated support"],
            price: "From ₵1,000",
            details: [
                "Priority booking and dedicated support",
                "5-day delivery guarantee",
                "Quality guarantee"
            ]
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: "Seasonal Collections",
            description: "Exclusive seasonal pieces designed with the latest fashion trends.",
            features: ["Limited editions", "Trend forecasting", "Premium materials"],
            price: "From ₵800",
            details: [
                "Exclusive seasonal pieces",
                "Limited editions",
                "Premium materials and quality guarantee"
            ]
        },
        {
            icon: <Heart className="w-5 h-5" />,
            title: "Bridal Couture",
            description: "Dream wedding dresses and formal wear for your special day.",
            features: ["Multiple fittings", "Custom embellishments", "Heirloom quality"],
            price: "From ₵3,500",
            details: [
                "Multiple fittings and custom embellishments",
                "Heirloom quality and preservation services",
                "Personalized service and support"
            ]
        },
    ];

    const handleServiceClick = (index: number) => {
        setSelectedService(index);
        setIsDialogOpen(true);
    };

    return (
        <section id="services" className="py-24 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Our <span className="text-gradient">Services</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From concept to creation, we offer comprehensive fashion services
                        tailored to your unique needs and style vision.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="group hover:shadow-luxury transition-luxury border-0 luxury-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-fashion-gradient rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-luxury">
                                    {service.icon}
                                </div>
                                <CardTitle className="text-xl font-serif">{service.title}</CardTitle>
                                <CardDescription className="text-base leading-relaxed">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-accent">{service.price}</span>
                                    <Button 
                                        variant="elegant" 
                                        size="sm"
                                        onClick={() => handleServiceClick(index)}
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Button variant="luxury" size="lg">
                        Schedule Your Consultation
                    </Button>
                </div>
            </div>

            {/* Service Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[95%] max-w-md p-4">
                    <DialogHeader>
                        <div className="flex items-start gap-3">
                            {selectedService !== null && (
                                <div className="w-10 h-10 bg-fashion-gradient rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    {services[selectedService].icon}
                                </div>
                            )}
                            <div className="flex-1">
                                <DialogTitle className="text-lg font-serif">
                                    {selectedService !== null && services[selectedService].title}
                                </DialogTitle>
                                <div className="text-base text-accent">
                                    {selectedService !== null && services[selectedService].price}
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    {selectedService !== null && (
                        <div className="space-y-4 py-2">
                            <p className="text-sm text-muted-foreground">
                                {services[selectedService].description}
                            </p>
                            
                            <div>
                                <h4 className="font-medium text-sm mb-1">Includes:</h4>
                                <ul className="space-y-1 text-sm">
                                    {services[selectedService].details.map((detail, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="pt-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {services[selectedService].features.map((feature, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-muted text-xs rounded-full whitespace-nowrap">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="text-xs h-8"
                                >
                                    Close
                                </Button>
                                <Button 
                                    variant="luxury"
                                    size="sm"
                                    className="text-xs h-8"
                                >
                                    <Calendar className="mr-2 h-3.5 w-3.5" />
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default Services;