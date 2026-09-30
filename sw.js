const CACHE='trilha-v7';
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);const response=await fetch('/');const html=await response.clone().text();await cache.put('/',response);const assets=[...new Set([...html.matchAll(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/g)].map(m=>m[1].replaceAll('&amp;','&')))];await cache.addAll(['/manifest.webmanifest','/icon-192.png','/icon-512.png',...assets]);await self.skipWaiting()})())});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('trilha-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api/')||event.request.headers.get('RSC'))return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put('/',clone)))}return response}).catch(()=>caches.match('/')));return;}
 if(url.pathname.startsWith('/_next/static/')||url.pathname.startsWith('/icon-')||url.pathname==='/manifest.webmanifest')event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,clone)))}return response})));
});
