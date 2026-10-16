import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
export const LazySwipingInterface = React.lazy(() => import('@/components/SwipingInterface'));
export const LazyCarousel3D = React.lazy(() => import('@/components/Carousel3D'));
export const LazyVoiceMorphingSVG = React.lazy(() => import('@/pages/azugh/components/voice'));

// Loading fallback components
export const SwipingInterfaceSkeleton = () => (
  <div className="w-full h-auto aspect-[9/16] flex flex-col items-center space-y-4">
    <Skeleton className="w-full h-3/4 rounded-lg" />
    <div className="flex gap-8">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-16 w-16 rounded-full" />
    </div>
  </div>
);

export const Carousel3DSkeleton = () => (
  <div className="flex justify-center space-x-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="w-32 h-40 rounded-lg" />
    ))}
  </div>
);

// Wrapper component with Suspense
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <div className="flex items-center justify-center p-8">Loading...</div> 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);
