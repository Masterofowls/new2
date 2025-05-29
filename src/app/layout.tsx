import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import './globals.css';
import '../styles/device-optimizations.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import type { Metadata } from 'next';

import { ClientPWAWrapper } from '@/components/client-pwa-wrapper';
import {
  AccessibilityProvider,
} from '@/components/ui/accessibility-enhancements';
import {
  CriticalPreload,
  FontOptimizer,
  PerformanceMetrics,
  ScriptOptimizer,
} from '@/components/ui/performance-optimizations';
import { DeviceProvider } from '@/hooks/use-device';
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false

export const metadata: Metadata = {
  title: "FinTech Pro - Advanced Financial Solutions",
  description: "Revolutionary financial platform with cutting-edge technology, real-time analytics, and seamless investment experiences.",
  keywords: "fintech, finance, investment, trading, banking, cryptocurrency, wealth management",
  authors: [{ name: "FinTech Pro" }],
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "FinTech Pro - Advanced Financial Solutions",
    description: "Revolutionary financial platform with cutting-edge technology",
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FinTech Pro - Advanced Financial Solutions",
    description: "Revolutionary financial platform with cutting-edge technology",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

// Separate viewport export for Next.js 15+ optimization
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <CriticalPreload />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FinTech Pro" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-inter antialiased bg-black text-white overflow-x-hidden">
        <DeviceProvider>
          <FontOptimizer>
            <AccessibilityProvider>
              {/* Performance monitoring component */}
              <PerformanceMetrics />
              
              {/* Optimize third-party scripts */}
              <ScriptOptimizer />
              
              {/* PWA Components - Client-side only */}
              <ClientPWAWrapper />
              
              <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                {children}
              </div>
            </AccessibilityProvider>
          </FontOptimizer>
        </DeviceProvider>
      </body>
    </html>
  );
}
