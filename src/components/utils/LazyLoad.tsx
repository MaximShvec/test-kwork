'use client';

import { Suspense, ComponentType, lazy } from 'react';

interface LazyLoadProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}


export function LazyLoad({ fallback = <LoadingFallback />, children }: LazyLoadProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}


function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="animate-pulse space-y-4 w-full max-w-3xl px-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}


export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <LazyLoad fallback={fallback}>
        <LazyComponent {...props} />
      </LazyLoad>
    );
  };
}


export function SectionSkeleton() {
  return (
    <div className="w-full py-12 px-4">
      <div className="container mx-auto animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}


export function GallerySkeleton() {
  return (
    <div className="w-full py-12 px-4">
      <div className="container mx-auto">
        <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}


export function FormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}
