import { useState, useEffect, Suspense, lazy } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { HeroSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy load components for better performance
const OptimizedHero = lazy(() => import('@/components/OptimizedHero'));
const Services = lazy(() => import('@/components/Services'));
const Portfolio = lazy(() => import('@/components/Portfolio'));
const About = lazy(() => import('@/components/About'));
const Contact = lazy(() => import('@/components/Contact'));

// Fallback component for Suspense
const SectionSkeleton = ({ height = 'h-96' }) => (
  <div className={`w-full ${height} bg-gray-50 animate-pulse`}>
    <div className="container mx-auto px-6 py-16">
      <div className="w-1/3 h-8 bg-gray-200 rounded mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the initial render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <HeroSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <Suspense fallback={<HeroSkeleton />}>
        <OptimizedHero />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Services />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Portfolio />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
        <Contact />
      </Suspense>
      
      <Footer />
    </main>
  );
};

export default Index;
