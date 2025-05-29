"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

// Types
type SyncOperation = {
  id: string;
  operation: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: number;
  retries: number;
  status: 'pending' | 'processing' | 'failed';
};

interface OfflineSyncProps {
  enableDebug?: boolean;
  onSyncComplete?: (results: { success: number; failed: number }) => void;
  onSyncStart?: () => void;
}

export const OfflineSync: React.FC<OfflineSyncProps> = ({
  enableDebug = false,
  onSyncComplete,
  onSyncStart,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingOperations, setPendingOperations] = useState<number>(0);
  const [syncStats, setSyncStats] = useState({ success: 0, failed: 0 });
  const [showNotification, setShowNotification] = useState(false);
  const { isMobile } = useDevice();

  // Initialize the database
  useEffect(() => {
    const initDatabase = async () => {
      if (typeof indexedDB === 'undefined') return;
      
      try {
        const db = await openDatabase();
        const count = await countPendingOperations(db);
        setPendingOperations(count);
      } catch (error) {
        console.error("Failed to initialize offline sync database:", error);
      }
    };
    
    initDatabase();
    
    // Listen for online/offline events
    const handleOnline = async () => {
      if (pendingOperations > 0) {
        syncOfflineOperations();
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    // Register for background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-offline-operations');
      }).catch(err => {
        console.error('Background sync registration failed:', err);
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [pendingOperations]);

  // Open the IndexedDB database
  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('offlineSyncDB', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('operations')) {
          const store = db.createObjectStore('operations', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Count pending operations
  const countPendingOperations = async (db: IDBDatabase): Promise<number> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readonly');
      const store = transaction.objectStore('operations');
      const index = store.index('status');
      const request = index.count('pending');
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Get all pending operations
  const getPendingOperations = async (db: IDBDatabase): Promise<SyncOperation[]> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readonly');
      const store = transaction.objectStore('operations');
      const index = store.index('status');
      const request = index.getAll('pending');
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Update operation status
  const updateOperationStatus = async (
    db: IDBDatabase, 
    id: string, 
    status: 'pending' | 'processing' | 'failed',
    retries?: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readwrite');
      const store = transaction.objectStore('operations');
      const request = store.get(id);
      
      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          data.status = status;
          if (retries !== undefined) {
            data.retries = retries;
          }
          store.put(data);
          resolve();
        } else {
          reject(new Error('Operation not found'));
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  };

  // Delete operation
  const deleteOperation = async (db: IDBDatabase, id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readwrite');
      const store = transaction.objectStore('operations');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  // Sync offline operations
  const syncOfflineOperations = async () => {
    if (isSyncing || !navigator.onLine) return;
    
    try {
      setIsSyncing(true);
      if (onSyncStart) onSyncStart();
      
      const db = await openDatabase();
      const operations = await getPendingOperations(db);
      
      if (operations.length === 0) {
        setIsSyncing(false);
        return;
      }
      
      let successCount = 0;
      let failedCount = 0;
      
      for (const operation of operations) {
        try {
          // Mark as processing
          await updateOperationStatus(db, operation.id, 'processing');
          
          // Process based on operation type
          let success = false;
          
          switch (operation.operation) {
            case 'create':
            case 'update':
              const response = await fetch(operation.endpoint, {
                method: operation.operation === 'create' ? 'POST' : 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(operation.data),
              });
              
              success = response.ok;
              break;
              
            case 'delete':
              const deleteResponse = await fetch(operation.endpoint, {
                method: 'DELETE',
              });
              
              success = deleteResponse.ok;
              break;
          }
          
          if (success) {
            await deleteOperation(db, operation.id);
            successCount++;
          } else {
            // If failed, increment retry count
            if (operation.retries < 3) {
              await updateOperationStatus(db, operation.id, 'pending', operation.retries + 1);
              failedCount++;
            } else {
              // Max retries reached, mark as failed
              await updateOperationStatus(db, operation.id, 'failed');
              failedCount++;
            }
          }
        } catch (error) {
          console.error("Error processing operation:", error);
          await updateOperationStatus(db, operation.id, 'pending', operation.retries + 1);
          failedCount++;
        }
      }
      
      setSyncStats({ success: successCount, failed: failedCount });
      setShowNotification(true);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      // Update count of pending operations
      const count = await countPendingOperations(db);
      setPendingOperations(count);
      
      if (onSyncComplete) {
        onSyncComplete({ success: successCount, failed: failedCount });
      }
    } catch (error) {
      console.error("Error during sync:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual sync button for debug mode
  const renderDebugControls = () => {
    if (!enableDebug) return null;
    
    return (
      <div className="fixed bottom-16 right-4 z-40 bg-gray-900 text-white p-3 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-2">Offline Sync Debug</h3>
        <div className="text-xs mb-2">Pending: {pendingOperations}</div>
        <button
          onClick={syncOfflineOperations}
          disabled={isSyncing || pendingOperations === 0 || !navigator.onLine}
          className={`
            px-3 py-1 rounded text-xs
            ${isSyncing || pendingOperations === 0 || !navigator.onLine
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    );
  };

  // Sync notification
  const renderSyncNotification = () => {
    if (!showNotification) return null;
    
    return (
      <div className={`
        fixed bottom-20 right-4 z-40 
        bg-gray-900 text-white 
        p-3 rounded-lg shadow-lg
        transform transition-transform duration-300
        ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <div className="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-bold">Sync Complete</span>
        </div>
        <div className="text-xs">
          {syncStats.success > 0 && <div>✅ {syncStats.success} operations synced</div>}
          {syncStats.failed > 0 && <div>❌ {syncStats.failed} operations failed</div>}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderDebugControls()}
      {renderSyncNotification()}
    </>
  );
};

// Hook to add operations to sync queue
export const useOfflineSync = () => {
  // Add an operation to sync queue
  const addSyncOperation = async (
    operation: 'create' | 'update' | 'delete',
    endpoint: string,
    data: any = {}
  ): Promise<string> => {
    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB not supported');
    }
    
    try {
      const db = await openDatabase();
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const syncOperation: SyncOperation = {
        id,
        operation,
        endpoint,
        data,
        timestamp: Date.now(),
        retries: 0,
        status: 'pending'
      };
      
      await addOperation(db, syncOperation);
      
      // Request sync if supported
      if ('serviceWorker' in navigator && 'SyncManager' in window && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-offline-operations');
        }).catch(err => {
          console.error('Background sync registration failed:', err);
        });
      }
      
      return id;
    } catch (error) {
      console.error("Error adding sync operation:", error);
      throw error;
    }
  };
  
  // Open database
  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('offlineSyncDB', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('operations')) {
          const store = db.createObjectStore('operations', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  // Add operation to store
  const addOperation = async (db: IDBDatabase, operation: SyncOperation): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readwrite');
      const store = transaction.objectStore('operations');
      const request = store.add(operation);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };
  
  return {
    create: (endpoint: string, data: any) => addSyncOperation('create', endpoint, data),
    update: (endpoint: string, data: any) => addSyncOperation('update', endpoint, data),
    delete: (endpoint: string) => addSyncOperation('delete', endpoint)
  };
};
