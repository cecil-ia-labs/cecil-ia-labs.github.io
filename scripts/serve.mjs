import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname,extname,sep} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const port=Number(process.env.PORT)||8080;
createServer(async(req,res)=>{
 try{
   const parsed=new URL(req.url,'http://localhost');
   const name=decodeURIComponent(parsed.pathname);
   const file=resolve(root,`.${name==='/'?'/index.html':name}`);
   if(!(file===root||file.startsWith(root+sep)) || /\/\./.test(name) || name.startsWith('/scripts/serve')){res.writeHead(404);res.end('Not found');return;}
   const info=await stat(file);if(!info.isFile())throw new Error('Not a file');
   const data=await readFile(file);
   res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(data);
 }catch{res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Not found');}
}).listen(port,()=>console.log(`Cecil-IA Labs portal: http://localhost:${port}`));
