const CACHE='tapaco-quy-v16';
const ASSETS=[
  './','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(u=>c.add(u)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;                 // bo qua POST (day du lieu)
  if(e.request.url.includes('script.google.com'))return; // luon goi mang cho dong bo
  if(e.request.url.includes('app.txt'))return;           // luon lay app.txt moi nhat (URL dong bo)
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{
      try{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}catch(_){}
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});
