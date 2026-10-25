import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
export async function optimizeImages(root,target) {
 const manifest=JSON.parse(await readFile(path.join(root,'optimized-images.json'),'utf8'));
 await mkdir(path.join(target,'assets'),{recursive:true});
 for (const name of new Set(Object.values(manifest.embedded))) await copyFile(path.join(root,'optimized-images',path.basename(name)),path.join(target,name));
 for (const [name,asset] of Object.entries(manifest.files)) {
  if(createHash('sha256').update(await readFile(path.join(root,'web-source',name))).digest('hex')!==manifest.sourceHashes[name]) throw Error('Image manifest outdated: '+name);
  await copyFile(path.join(root,'optimized-images',path.basename(asset)),path.join(target,name.replace(/\.png$/,path.extname(asset))));
 }
 const paths=Object.fromEntries(Object.entries(manifest.files).map(([name,asset])=>['./'+name,'./'+name.replace(/\.png$/,path.extname(asset))]));
 await writeFile(path.join(target,'image-paths.js'),'window.LeseImagePath=p=>('+JSON.stringify(paths)+')[p]||p;');
 for (const name of await readdir(target)) {
  if (name === 'image-paths.js' || !/\.(html|js|css|webmanifest)$/.test(name)) continue;
  let text=await readFile(path.join(target,name),'utf8');
  text=text.replace(/data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+/g,value=>{
   const asset=manifest.embedded[createHash('sha256').update(value).digest('hex')];
   if(!asset) throw Error('Image manifest outdated: '+name);
   return './'+asset;
  });
  for (const [original,asset] of Object.entries(manifest.files)) text=text.split(original).join(original.replace(/\.png$/,path.extname(asset)));
  text=text.replace(/`(\.\/pokal-(?:sport|freizeit|maerchen)-\$\{[^}]+\}\.png)`/g,'window.LeseImagePath($&)');
  if(name.endsWith('.html')) text=text.replace('</head>','<script src="./image-paths.js"></script></head>');
  await writeFile(path.join(target,name),text);
 }
}


