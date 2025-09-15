import { useState, useEffect, useCallback } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { ConsultationForm } from './ConsultationForm';

// Import your hero images with different sizes for responsive loading
import heroFashion from '@/assets/hero-fashion.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';
import hero4 from '@/assets/hero-4.jpg';

// Import placeholder for lazy loading
import placeholder from '@/assets/placeholder.svg';

// Define the type for our hero images
interface HeroImage {
  src: string;
  alt: string;
  placeholder: string;
}

const heroImages: HeroImage[] = [
  { src: heroFashion, alt: 'Luxury fashion design', placeholder },
  { src: hero2, alt: 'Elegant clothing collection', placeholder },
  { src: hero3, alt: 'Bespoke tailoring', placeholder },
  { src: hero4, alt: 'High-end fashion', placeholder },
];

const OptimizedHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to handle SSR
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (!isMounted || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [isMounted, isTransitioning]);

  const goToNext = useCallback(() => {
    goToSlide((currentIndex + 1) % heroImages.length);
  }, [currentIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + heroImages.length) % heroImages.length);
  }, [currentIndex, goToSlide]);

  // Get current and next images
  const currentImage = heroImages[currentIndex];
  const nextImage = heroImages[(currentIndex + 1) % heroImages.length];

  if (!isMounted) {
    // Return a simple loading state or null during SSR
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse w-full h-screen bg-gray-200"></div>
      </div>
    );
  }

  return (
    <>
      <section 
        id="home" 
        className="min-h-screen relative overflow-hidden group"
        aria-label="Hero section with fashion showcase"
      >
        {/* Background images with transitions and lazy loading */}
        <div className="absolute inset-0">
          <LazyLoadImage
            src={currentImage.src}
            alt={currentImage.alt}
            placeholderSrc={currentImage.placeholder}
            effect="opacity"
            className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            wrapperClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-6 bg-secondary' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-32 min-h-screen flex items-center">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-secondary" aria-hidden="true" />
              <span className="text-secondary font-medium tracking-wide uppercase">
                Luxury Fashion Design
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              <span className="text-white">Crafting</span>
              <br />
              <span className="text-gradient">Bespoke Elegance</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              Transform your vision into reality with our expert fashion design services.
              From custom garments to complete wardrobe curation, we create pieces that
              define your unique style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="gold" 
                size="lg" 
                className="group"
                onClick={() => setIsFormOpen(true)}
                aria-label="Book a consultation"
              >
                <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
                Book Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>

              {/*<Button */}
              {/*  variant="hero" */}
              {/*  size="lg"*/}
              {/*  aria-label="View our portfolio"*/}
              {/*>*/}
              {/*  View Portfolio*/}
              {/*</Button>*/}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form Modal */}
      <ConsultationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)} 
      />
    </>
  );
};

export default OptimizedHero;
