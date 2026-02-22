const CACHE_NAME = "warehouse-v1";
const API_CACHE = "warehouse-api-v1";

self.addEventListener("fetch", event => {
    const { request } = event;

    if (request.url.includes("/api/")) {
        event.respondWith(
            fetch(request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(API_CACHE).then(cache => {
                        cache.put(request, clone);
                    });
                    return res;
                })
                .catch(() =>
                    caches.match(request)
                )
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(res => res || fetch(request))
    );
});