const CACHE="tachocontrol-v1-13-4-gh2";
const FILES=["./","./index.html","./manifest.webmanifest","./icons/icon.svg"];

self.addEventListener("install",e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())
));
self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener("message",e=>{if(e.data?.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{
      const x=r.clone(); caches.open(CACHE).then(c=>c.put("./index.html",x)); return r;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
    if(r?.ok){const x=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,x));}
    return r;
  }).catch(()=>cached)));
});