from pathlib import Path
import re
D=Path(__file__).resolve().parent/'dist'
paths={'↗':'M5 19 19 5M5 5h14v14','↙':'M19 5 5 19M5 5v14h14','↓':'M12 4v16M5 13l7 7 7-7','↑':'M12 20V4M5 11l7-7 7 7','←':'M20 12H4m7-7-7 7 7 7','→':'M4 12h16m-7-7 7 7-7 7','✓':'m5 12 4 4L19 6','×':'m6 6 12 12M6 18 18 6','✳':'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6'}
def icon(path):return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="'+path+'"/></svg>'
for p in D.glob('*.html'):
 s=p.read_text();parts=re.split(r'(<[^>]+>)',s)
 for i in range(0,len(parts),2):
  for char,path in paths.items():parts[i]=parts[i].replace(char,icon(path))
 s=''.join(parts).replace('creative.js?v=20261101','creative.js?v=20261101-mobile').replace('creative.css?v=20261101','creative.css?v=20261101-mobile').replace('style.css?v=20261101','style.css?v=20261101-mobile').replace('app.js?v=20261101','app.js?v=20261101-mobile')
 s=s.replace('<script src="creative.js', '<script src="icons.js?v=20261101-mobile" defer></script><script src="creative.js')
 p.write_text(s)
