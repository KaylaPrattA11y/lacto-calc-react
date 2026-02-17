// Basic service worker for offline support
const FERMENT_NOTIFICATIONS_KEY = 'fermentNotifications';

console.log('[SW] Service worker script loaded');

self.addEventListener('install', event => {
  console.log('[SW] Service worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Service worker activating');
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});

// Listen for messages from the main thread to schedule notifications
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  if (event.data.type === 'SCHEDULE_FERMENT_NOTIFICATION') {
    console.log('[SW] Scheduling ferment notification');
    const ferment = event.data.payload.ferment;
    scheduleFermentNotification(ferment);
  }
});

function scheduleFermentNotification(ferment) {
  console.log('[SW] scheduleFermentNotification called with:', ferment);
  
  if (!ferment.dateEnd || !ferment.sendNotification) {
    console.log('[SW] Ferment missing dateEnd or sendNotification flag', {
      dateEnd: ferment.dateEnd,
      sendNotification: ferment.sendNotification
    });
    return;
  }

  // Calculate time until ferment is complete
  const endDate = new Date(`${ferment.dateEnd}T23:59:59`).getTime();
  const now = Date.now();
  const delayMs = endDate - now;

  console.log('[SW] Calculated delay:', { endDate, now, delayMs });

  if (delayMs <= 0) {
    console.log('[SW] Ferment end date is in the past');
    return;
  }

  // Schedule the notification
  setTimeout(() => {
    console.log('[SW] Showing notification');
    const title = ferment.fermentName || 'Fermentation Complete';
    const options = {
      body: `Your ferment is ready! ${ferment.weight} ${ferment.unit} of ${ferment.fermentName || 'ferment'} has finished fermenting.`,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: `ferment-${ferment.id}`,
      requireInteraction: false
    };

    self.registration.showNotification(title, options);
    console.log(`[SW] Notification scheduled for ferment: ${ferment.fermentName}`, {
      delayHours: (delayMs / (1000 * 60 * 60)).toFixed(1),
      endDate: ferment.dateEnd
    });
  }, delayMs);

  // Also store notification schedule in IndexedDB for persistence
  storeNotificationSchedule(ferment);
}

function storeNotificationSchedule(ferment) {
  // Open IndexedDB to persist notification schedules
  // Use version 2 to trigger onupgradeneeded if database already exists
  const request = indexedDB.open('LactoCal', 2);

  request.onerror = () => {
    console.error('Failed to open IndexedDB:', request.error);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log('IndexedDB upgrade needed, current version:', event.oldVersion);
    // Create object store if it doesn't exist
    if (!db.objectStoreNames.contains('fermentNotifications')) {
      db.createObjectStore('fermentNotifications', { keyPath: 'id' });
      console.log('Created fermentNotifications object store');
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    console.log('IndexedDB opened successfully. Object stores:', Array.from(db.objectStoreNames));
    
    try {
      const transaction = db.transaction(['fermentNotifications'], 'readwrite');
      const store = transaction.objectStore('fermentNotifications');
      
      const data = {
        id: ferment.id,
        fermentName: ferment.fermentName,
        dateEnd: ferment.dateEnd,
        scheduledAt: new Date().toISOString()
      };
      
      store.put(data);
      console.log('Stored notification schedule:', data);
      
      transaction.oncomplete = () => {
        console.log('Transaction completed successfully');
      };
    } catch (error) {
      console.error('Error storing notification schedule:', error);
    } finally {
      db.close();
    }
  };
}
