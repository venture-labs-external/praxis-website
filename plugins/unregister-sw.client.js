// Replaces the old `@nuxtjs/pwa` service worker (dropped, VL-8-D?): this static
// site needs no offline support, but a returning visitor's browser may still have
// the old `sw.js` registered and serving cached, stale assets. This plugin
// unregisters any existing service worker and clears its caches once on mount, so
// the very next navigation fetches the new static export fresh instead of the old
// cached one - no manual hard reload required.
export default defineNuxtPlugin(() => {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) {
    return;
  }

  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    })
    .catch(() => {
      // Nothing we can do if the browser refuses; the old worker simply stays
      // registered until its own cache/update logic eventually expires it.
    });

  if (typeof caches !== 'undefined') {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch(() => {});
  }
});
