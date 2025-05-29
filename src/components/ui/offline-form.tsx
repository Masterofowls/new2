"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface FormData {
  [key: string]: any;
}

interface OfflineFormProps {
  endpoint: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export const OfflineForm: React.FC<OfflineFormProps> = ({
  endpoint,
  onSuccess,
  onError,
  children,
}) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const { isMobile } = useDevice();

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial value
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }
    
    // Check if there's any stored offline data
    checkForOfflineData();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  // Check for stored form data
  const checkForOfflineData = async () => {
    try {
      if (typeof indexedDB === 'undefined') return;
      
      const db = await openDB();
      const transaction = db.transaction(['offlineForms'], 'readonly');
      const store = transaction.objectStore('offlineForms');
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        setHasOfflineData(countRequest.result > 0);
      };
    } catch (error) {
      console.error('Error checking for offline data:', error);
    }
  };

  // Open IndexedDB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('offlineForms', 1);
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('offlineForms')) {
          db.createObjectStore('offlineForms', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Submit form data
  const submitForm = async (data: FormData) => {
    if (isOffline) {
      // Store in IndexedDB for later sync
      try {
        const db = await openDB();
        const transaction = db.transaction(['offlineForms'], 'readwrite');
        const store = transaction.objectStore('offlineForms');
        
        await store.add({
          endpoint,
          data,
          timestamp: Date.now()
        });
        
        setHasOfflineData(true);
        
        if (onSuccess) {
          onSuccess({ offlineStored: true, message: 'Data saved offline' });
        }
      } catch (error) {
        console.error('Error storing offline data:', error);
        if (onError) {
          onError(new Error('Failed to store data offline'));
        }
      }
    } else {
      // Online submission
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    }
  };

  // Sync offline data when back online
  const syncOfflineData = async () => {
    if (isOffline || !hasOfflineData) return;
    
    try {
      setIsSyncing(true);
      
      const db = await openDB();
      const transaction = db.transaction(['offlineForms'], 'readonly');
      const store = transaction.objectStore('offlineForms');
      const offlineForms = await store.getAll();
      
      for (const form of offlineForms) {
        try {
          const response = await fetch(form.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.data),
          });
          
          if (response.ok) {
            // Remove from IndexedDB
            const deleteTransaction = db.transaction(['offlineForms'], 'readwrite');
            const deleteStore = deleteTransaction.objectStore('offlineForms');
            await deleteStore.delete(form.id);
          }
        } catch (error) {
          console.error('Error syncing form:', error);
        }
      }
      
      // Check if any forms are left
      checkForOfflineData();
      
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Try to sync when we come back online
  useEffect(() => {
    if (!isOffline && hasOfflineData) {
      syncOfflineData();
    }
  }, [isOffline, hasOfflineData]);

  // Create a form component that will handle submissions
  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const formData = new FormData(e.currentTarget);
      const data: FormData = {};
      
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      submitForm(data);
    };
    
    return (
      <form onSubmit={handleSubmit}>
        {hasOfflineData && !isOffline && isSyncing && (
          <div className="bg-blue-500 text-white p-2 mb-4 rounded text-sm">
            Syncing offline data...
          </div>
        )}
        
        {hasOfflineData && isOffline && (
          <div className="bg-yellow-500 text-white p-2 mb-4 rounded text-sm">
            You have offline data that will be sent when back online
          </div>
        )}
        
        {isOffline && (
          <div className="bg-yellow-600 text-white p-2 mb-4 rounded text-sm">
            You're offline. Form data will be saved locally and submitted when connection is restored.
          </div>
        )}
        
        {children}
        
        <button
          type="submit"
          className={`
            mt-4 px-6 py-2 bg-blue-600 text-white rounded-md
            ${isMobile ? 'w-full' : ''}
            min-h-[44px]
            flex items-center justify-center
            transition-colors hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          disabled={isSyncing}
        >
          {isSyncing ? 'Syncing...' : isOffline ? 'Save Offline' : 'Submit'}
        </button>
      </form>
    );
  };
  
  return <FormWrapper>{children}</FormWrapper>;
};
