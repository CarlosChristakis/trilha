// Local verification of the exported files; no Next.js server and no server-side API.
import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','hostinger-site');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');const decoded=decodeURIComponent(url.pathname);
  if(decoded.split('/').some(s=>s.startsWith('.'))){res.writeHead(403);res.end();return;}
  let target=path.resolve(root,'.'+decoded);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);res.end();return;}
  if((await stat(target)).isDirectory())target=path.join(target,'index.html');
  const body=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(3108,'127.0.0.1',()=>console.log('Static Hostinger preview: http://127.0.0.1:3108'));
