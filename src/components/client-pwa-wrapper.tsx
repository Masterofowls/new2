"use client";

import React from 'react';

import dynamic from 'next/dynamic';

// Dynamically import PWA components with no SSR
const PWAComponentsNoSSR = dynamic(
  () => import('@/components/pwa-components').then(mod => mod.PWAComponents),
  { ssr: false }
);

export function ClientPWAWrapper() {
  return <PWAComponentsNoSSR />;
}
