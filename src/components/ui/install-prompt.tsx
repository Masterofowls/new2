"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { isMobile } = useDevice();

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.matchMedia('(display-mode: fullscreen)').matches ||
                          window.matchMedia('(display-mode: minimal-ui)').matches ||
                          (window.navigator as any).standalone === true; // For iOS
      
      setIsInstalled(isStandalone);
    };
    
    checkInstalled();
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Only auto-show on mobile after 30 seconds of engagement
      if (isMobile) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 30000); // 30 seconds
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile]);
  
  // Don't show if already installed or no install prompt available
  if (isInstalled || !installPrompt || !showPrompt) {
    return null;
  }
  
  const handleInstall = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Reset the prompt variable
    setInstallPrompt(null);
    setShowPrompt(false);
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
  };
  
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50 
      bg-black bg-opacity-90 text-white border-t border-gray-800
      ${isMobile ? 'px-4 py-4' : 'px-6 py-5'} 
      flex flex-col md:flex-row justify-between items-center
      transform transition-transform duration-300
      shadow-lg
    `}
    style={{
      paddingBottom: `calc(${isMobile ? '1rem' : '1.25rem'} + env(safe-area-inset-bottom, 0px))`,
    }}>
      <div className="flex flex-col mb-3 md:mb-0 md:mr-4">
        <h3 className="font-bold text-lg">Install FinTech Pro</h3>
        <p className="text-sm text-gray-300">Get the full app experience with faster access and offline features</p>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={handleDismiss}
          className="px-4 py-2 border border-gray-600 rounded-md text-sm hover:bg-gray-800 transition-colors"
        >
          Not Now
        </button>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Install App
        </button>
      </div>
    </div>
  );
};
