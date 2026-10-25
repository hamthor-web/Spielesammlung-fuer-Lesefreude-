"""Prepare lossless images; original web-source stays unchanged. Requires Pillow."""
import pathlib,re,hashlib,base64,io,json
from PIL import Image
root=pathlib.Path(__file__).resolve().parent.parent
src=root/'web-source'; dest=root/'optimized-images'; dest.mkdir(exist_ok=True)
manifest={'embedded':{},'files':{},'pixelChecks':0,'sourceHashes':{}}
def convert(data,keep_smallest=True):
 key=hashlib.sha256(data).hexdigest(); name=key+'.webp'; out=dest/name
 im=Image.open(io.BytesIO(data)); im.load()
 if not out.exists() or out.stat().st_size==0:im.save(out,format='WEBP',lossless=True,quality=75,method=1,exact=True)
 decoded=Image.open(out).convert('RGBA'); original=im.convert('RGBA')
 assert decoded.size==original.size and decoded.tobytes()==original.tobytes(),name
 if keep_smallest and len(data)<out.stat().st_size:
  ext={'JPEG':'jpg','PNG':'png','WEBP':'webp'}[im.format]; name=key+'.'+ext; (dest/name).write_bytes(data)
 manifest['pixelChecks']+=1
 return 'assets/'+name
for f in sorted(src.iterdir()):
 if f.suffix in ('.html','.js','.css'):
  text=f.read_text(encoding='utf-8')
  for m in re.finditer(r'data:image/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+',text):
   key=hashlib.sha256(m[0].encode()).hexdigest()
   if key not in manifest['embedded']:manifest['embedded'][key]=convert(base64.b64decode(m[0].split(',',1)[1]))
 elif f.suffix=='.png':
  manifest['files'][f.name]=convert(f.read_bytes()); manifest['sourceHashes'][f.name]=hashlib.sha256(f.read_bytes()).hexdigest()
(root/'optimized-images.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Verified exact RGBA pixels:',manifest['pixelChecks'],'Total optimized bytes:',sum(f.stat().st_size for f in dest.iterdir()))


