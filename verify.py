from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import re
D=Path(__file__).resolve().parent/'dist'
class Page(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.ids=[];self.links=[];self.local=[];self.images=[];self.titles=0;self.h1=0;self.dialogs=0;self.iframe=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a':self.links.append(a.get('href',''))
  if tag in ['script','img','link']:
   url=a.get('src') if tag!='link' else a.get('href')
   if url and not urlsplit(url).scheme:self.local.append(url)
  if tag=='img':self.images.append(a)
  if tag=='title':self.titles+=1
  if tag=='h1':self.h1+=1
  if tag=='dialog':self.dialogs+=1
  if tag=='iframe':self.iframe.append(a)
pages={}
for f in D.glob('*.html'):
 p=Page();p.feed(f.read_text());pages[f.name]=p
errors=[]
for name,p in pages.items():
 if p.titles!=1 or p.h1!=1:errors.append((name,'expected exactly one title and H1'))
 if len(p.ids)!=len(set(p.ids)):errors.append((name,'duplicate IDs'))
 if p.dialogs!=2:errors.append((name,'missing navigation dialog'))
 for img in p.images:
  if 'alt' not in img:errors.append((name,'missing image alt'))
  if not img.get('width') or not img.get('height'):errors.append((name,'missing image dimensions'))
 for url in p.local:
  if not (D/unquote(urlsplit(url).path)).is_file():errors.append((name,'missing asset',url))
 for href in p.links:
  if not href:errors.append((name,'empty link'));continue
  u=urlsplit(href)
  if u.scheme or href.startswith('//'):continue
  target=u.path or name
  if target not in pages:errors.append((name,'missing target',target));continue
  if u.fragment and unquote(u.fragment) not in pages[target].ids:errors.append((name,'missing fragment',href))
 if p.iframe:errors.append((name,'iframe loaded before consent'))
index=(D/'index.html').read_text();video=(D/'videos.html').read_text()
assert len(re.findall('class="session-card ',video))==11
assert 'open.spotify.com/artist/' not in index
assert 'fonts.googleapis.com' not in index
assert '<form' in index and 'type="email"' in index and 'required' in index
print(f'Checked {len(pages)} HTML pages, {sum(len(p.links) for p in pages.values())} links, local assets, image dimensions, unique IDs, consent-gated player and 11 sessions.')
print('Errors:',errors)
assert not errors
