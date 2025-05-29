"use client";

import React from 'react';

import dynamic from 'next/dynamic';

// Dynamically import ServiceWorkerRegistration with no SSR
const ServiceWorkerRegistrationNoSSR = dynamic(
  () => import('@/lib/service-worker-registration'),
  { ssr: false }
);

// Dynamically import OfflineDetector with no SSR
const OfflineDetectorNoSSR = dynamic(
  () => import('@/components/ui/offline-detector').then(mod => mod.OfflineDetector),
  { ssr: false }
);

// Dynamically import InstallPrompt with no SSR
const InstallPromptNoSSR = dynamic(
  () => import('@/components/ui/install-prompt').then(mod => mod.InstallPrompt),
  { ssr: false }
);

// Dynamically import ConnectionQuality with no SSR
const ConnectionQualityNoSSR = dynamic(
  () => import('@/components/ui/connection-quality').then(mod => mod.ConnectionQuality),
  { ssr: false }
);

// Dynamically import OfflineSync with no SSR
const OfflineSyncNoSSR = dynamic(
  () => import('@/components/ui/offline-sync').then(mod => mod.OfflineSync),
  { ssr: false }
);

// This component wraps our PWA-related client components
export function PWAComponents() {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <>
      <ServiceWorkerRegistrationNoSSR />
      <OfflineDetectorNoSSR />
      <InstallPromptNoSSR />
      <ConnectionQualityNoSSR />
      <OfflineSyncNoSSR enableDebug={isDev} />
    </>
  );
}
