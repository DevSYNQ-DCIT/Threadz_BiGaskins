import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Users, Clock, Star } from 'lucide-react';
import designPortfolio from '@/assets/design-portfolio.jpg'; // ✅ Must exist

const About = () => {
    const achievements = [
        {
            icon: <Award className="w-6 h-6" />,
            title: "Award-Winning Design",
            description: "Multiple fashion industry awards for excellence in custom couture.",
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "500+ Happy Clients",
            description: "Trusted by discerning clients who value quality and craftsmanship.",
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "3+ Years Experience",
            description: "Over a decade of expertise in luxury fashion and design.",
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Premium Materials",
            description: "Sourcing only the finest fabrics and materials from around the world.",
        },
    ];

    return (
        <section id="about" className="py-24 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            About <span className="text-gradient">Threadz BiGaskins</span>
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Founded with a passion for exceptional craftsmanship and timeless elegance,
                            Threadz BiGaskins has been at the forefront of luxury fashion design for over
                            a decade. We believe that every garment should tell a story, reflect personality,
                            and enhance the wearer's confidence.
                        </p>

                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Our team of skilled artisans and designers work closely with each client to
                            create bespoke pieces that are not just clothing, but wearable art. From the
                            initial consultation to the final fitting, we ensure every detail exceeds
                            your expectations.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-black via-gray-800 to-stone-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        {achievement.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base">{achievement.title}</h3>
                                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button variant="luxury" size="lg">
                            Meet Our Team
                        </Button>
                    </div>

                    {/* Right: Image + Floating Cards */}
                    <div className="relative">
                        {/* Main Image */}
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src={designPortfolio}
                                alt="Luxury fashion design studio with mannequins and elegant dresses"
                                className="w-full h-[600px] object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                        </div>

                        {/* Floating Stats Card (Bottom Left) */}
                        <Card className="absolute -bottom-6 -left-6 border-0 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-primary mb-1">98%</div>
                                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                            </CardContent>
                        </Card>

                        {/* Floating Stats Card (Top Right) */}
                        <Card className="absolute -top-6 -right-6 border-0 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-secondary mb-1">24/7</div>
                                <div className="text-sm text-muted-foreground">Design Support</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;