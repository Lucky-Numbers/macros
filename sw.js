self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', e => {
  let d = { title: 'Macros', body: '' };
  try { d = e.data.json(); } catch (err) { if (e.data) d.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(d.title || 'Macros', {
    body: d.body || '',
    icon: 'icon.png',
    badge: 'icon.png',
    tag: d.tag || undefined,   // same tag replaces the previous banner instead of stacking
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.includes('/macros')) return c.focus(); }
    return clients.openWindow('./');
  }));
});
