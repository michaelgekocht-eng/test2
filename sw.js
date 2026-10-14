// アプリ本体を更新したら VERSION を変えると、端末のキャッシュが入れ替わります
const VERSION = "nippo-v9";
const FILES = ["./","./index.html","./jsQR.js","./manifest.json",
  "./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const u = new URL(e.request.url);
  if(e.request.method!=="GET" || u.origin!==location.origin) return; // 住所検索などは通常通信
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(hit=>hit ||
      fetch(e.request).catch(()=>caches.match("./index.html")))
  );
});
