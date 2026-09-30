import { cp, mkdir, readFile, writeFile, symlink, lstat, rm, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stage=path.join(root,'.hostinger-build');
// Only delete generated directories whose exact locations were checked inside this project.
async function clearGenerated(name){
 const target=path.resolve(root,name);
 if(!['.hostinger-build','hostinger-site'].includes(name)||path.dirname(target)!==root)throw new Error('Unsafe generated directory');
 try{const stat=await lstat(target);if(stat.isSymbolicLink())throw new Error('Generated directory is a link');if(await realpath(target)!==target)throw new Error('Unexpected directory location');await rm(target,{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
}
await clearGenerated('.hostinger-build');await mkdir(stage);
await cp(path.join(root,'src'),path.join(stage,'src'),{recursive:true,filter:p=>p!==path.join(root,'src','app','api')});
await cp(path.join(root,'public'),path.join(stage,'public'),{recursive:true});
for(const name of ['package.json','package-lock.json','tsconfig.json','postcss.config.mjs'])await cp(path.join(root,name),path.join(stage,name));
// Dependencies stay local; neither secrets nor server API routes enter the export.
await symlink(path.join(root,'node_modules'),path.join(stage,'node_modules'),process.platform==='win32'?'junction':'dir');
await writeFile(path.join(stage,'next.config.mjs'),"export default { output: 'export', trailingSlash: true, images: { unoptimized: true }, outputFileTracingRoot: process.cwd() };\n");
const tsconfig=JSON.parse(await readFile(path.join(stage,'tsconfig.json'),'utf8'));
tsconfig.include=['next-env.d.ts','src/**/*.ts','src/**/*.tsx','.next/types/**/*.ts'];
await writeFile(path.join(stage,'tsconfig.json'),JSON.stringify(tsconfig,null,2));
const result=spawnSync(process.execPath,[path.join(root,'node_modules','next','dist','bin','next'),'build','--webpack'],{cwd:stage,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
if(result.status!==0)process.exit(result.status||1);
await clearGenerated('hostinger-site');
const output=path.join(root,'hostinger-site');
await cp(path.join(stage,'out'),output,{recursive:true});
await writeFile(path.join(output,'.htaccess'),`DirectoryIndex index.html
<IfModule mod_headers.c>
 <FilesMatch "^(index\\.html|sw\\.js|manifest\\.webmanifest)$">
  Header set Cache-Control "no-cache"
 </FilesMatch>
</IfModule>
`);
await writeFile(path.join(output,'.nojekyll'),'');
const index=await readFile(path.join(output,'index.html'),'utf8');
if(!index.includes('trilha')||!index.includes('/_next/static/'))throw new Error('Missing application in generated index.html');
console.log('\nReady: hostinger-site/ — deploy its CONTENTS to the subdomain document root.');
