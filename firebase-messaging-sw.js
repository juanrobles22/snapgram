importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBm6_-Q3RZ-YAuIcNhlzhFOC9iQ98NA3GY",
  authDomain: "snapgram-66b5e.firebaseapp.com",
  databaseURL: "https://snapgram-66b5e-default-rtdb.firebaseio.com",
  projectId: "snapgram-66b5e",
  storageBucket: "snapgram-66b5e.firebasestorage.app",
  messagingSenderId: "1062450467291",
  appId: "1:1062450467291:web:34becb95fe4db8268597fe"
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage(payload => {
  const { title, body, icon, data } = payload.notification || payload.data || {};

  const notifTitle = title || 'SnapGram';
  const notifBody  = body  || 'You have a new notification';

  const options = {
    body: notifBody,
    icon: icon || '/snapgram/icon.png',
    badge: '/snapgram/icon.png',
    vibrate: [200, 100, 200, 100, 200],
    data: data || {},
    actions: [],
    requireInteraction: true
  };

  // If it's a call notification add answer/decline actions
  if (payload.data && payload.data.type === 'call') {
    options.actions = [
      { action: 'answer',  title: '✅ Answer' },
      { action: 'decline', title: '📵 Decline' }
    ];
    options.vibrate = [300, 100, 300, 100, 300, 100, 300];
    options.requireInteraction = true;
  }

  self.registration.showNotification(notifTitle, options);
});

// Handle notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const data = e.notification.data || {};
  const url  = data.url || '/snapgram/';

  if (e.action === 'decline' && data.callId) {
    // Decline call via fetch (can't use Firebase directly in SW easily)
    // The app will handle this via the incomingCall listener
  }

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('snapgram') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open app
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
