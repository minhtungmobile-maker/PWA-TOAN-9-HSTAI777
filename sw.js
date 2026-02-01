const CACHE_NAME = "pwa-toan9-v1";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",

  "/lessons/dai-so/ch1-can-bac-hai.html",
  "/lessons/dai-so/ch2-ham-so-bac-nhat.html",
  "/lessons/dai-so/ch3-he-phuong-trinh.html",
  "/lessons/dai-so/ch4-ham-so-bac-hai.html",

  "/lessons/hinh-hoc/ch1-he-thuc-luong.html",
  "/lessons/hinh-hoc/ch2-duong-tron.html",
  "/lessons/hinh-hoc/ch3-goc-noi-tiep.html",

  "/exercises/de-on-thi-vao-10-1.html",
  "/exercises/de-on-thi-vao-10-2.html",
  "/exercises/de-1-tiet.html",
  "/exercises/de-15-phut.html",

  "/hs-yeu/nen-tang.html",
  "/hs-yeu/10-dang-bat-buoc.html",
  "/hs-yeu/de-tu-5-len-9.html"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return res;
      })
      .catch(() =>
        caches.match(event.request).then(res => res || caches.match("/offline.html"))
      )
  );
});
