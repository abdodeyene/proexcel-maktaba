self.addEventListener('push', function (event) {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = {}
  }

  const title   = payload.title || 'Nouvelle commande — ProExcel'
  const options = {
    body:    payload.body  || 'Vous avez une nouvelle commande.',
    icon:    '/favicon.ico',
    badge:   '/favicon.ico',
    tag:     'proexcel-order',
    renotify: true,
    data: {
      url: payload.url || '/admin/orders',
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/admin/orders'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (const client of list) {
        if (client.url.includes(target) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(target)
      }
    })
  )
})
