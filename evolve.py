"""Apply shared creative enhancements to generated, human-edited pages."""
from pathlib import Path
import re
D=Path(__file__).resolve().parent/'dist'
for p in D.glob('*.html'):
 s=p.read_text()
 if 'creative.css' in s: continue
 s=s.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="creative.css">')
 s=s.replace('<script src="app.js" defer></script>','<script src="app.js?v=20261101" defer></script><script src="creative.js?v=20261101" defer></script>')
 s=s.replace('href="style.css"','href="style.css?v=20261101"').replace('href="creative.css"','href="creative.css?v=20261101"')
 s=s.replace('House music. Good company.','ghostak &amp; artemis · Freiburg')
 s=s.replace('Ein Klick öffnet das Video auf YouTube.','Ihr könnt die Videos hier laden oder direkt auf YouTube öffnen.')
 s=s.replace('auf YouTube ansehen"','ansehen"')
 if p.name=='contact.html':
  s=s.replace('</main>','<section class="container storage-note"><h2>Gemerkte Sessions</h2><p>Wenn ihr eine Session merkt, speichern wir nur deren Video-ID lokal in eurem Browser. Auch eure gewählte Bewegungspause bleibt in diesem Browser gespeichert. Diese Einstellungen werden nicht an uns übertragen. Zum Entfernen könnt ihr die Sessions abwählen oder die Website-Daten im Browser löschen.</p></section></main>')
 if p.name=='index.html':
  start=s.index('<section id="hero"');end=s.index('<section id="music"',start)
  hero='''<section id="hero" class="hero creative-hero"><div class="container"><div class="hero-topline"><p class="eyebrow"><span class="status-dot"></span> DJ-Duo aus Freiburg</p><a class="hero-toplink" href="videos.html">Unsere Sessions <span aria-hidden="true">↗</span></a></div><h1 class="hero-title"><span class="hero-prefix">Wir sind</span> <span class="hero-word">ZweiKlang<span class="title-dot">.</span></span></h1><div class="hero-editorial"><p>Wir sind ghostak und artemis aus Freiburg und legen zusammen House auf.</p><div class="hero-actions"><a class="button" href="#music">Ein Set anhören <span aria-hidden="true">↗</span></a><a class="text-link" href="#contact">Booking anfragen <span aria-hidden="true">↗</span></a></div></div><div class="hero-diptych"><figure><img src="assets/ghostak-sunset.jpg" alt="ghostak am DJ-Pult bei Sonnenuntergang" width="1365" height="2048" fetchpriority="high"><figcaption><span>ghostak</span><span aria-hidden="true">01</span></figcaption></figure><figure><img src="assets/artemis-sunset.jpg" alt="artemis mit Kopfhörern am DJ-Pult" width="1365" height="2048"><figcaption><span>artemis</span><span aria-hidden="true">02</span></figcaption></figure><a class="hero-listen" href="#music" aria-label="Zur Musik"><span aria-hidden="true">↙</span> Reinhören</a></div><div class="hero-bottom"><span>Deep · Organic · Afro House</span><a href="#music">Musik entdecken <span aria-hidden="true">↓</span></a><span>Freiburg im Breisgau</span></div></div></section>'''
  s=s[:start]+hero+s[end:]
 # Shared event filters use actual archived categories only.
 s=s.replace('<div class="event-list reveal">','''<div class="event-filters" role="group" aria-label="Auftritte filtern"><button type="button" data-event-filter="all" aria-pressed="true">Alle</button><button type="button" data-event-filter="Bar / Club" aria-pressed="false">Bar / Club</button><button type="button" data-event-filter="Draußen" aria-pressed="false">Draußen</button><button type="button" data-event-filter="Rooftop" aria-pressed="false">Rooftop</button></div><p class="sr-only event-filter-status" role="status"></p><div class="event-list reveal">''')
 # Keep anchors as progressive fallback; JS adds inline viewing and a separate save control.
 if 'session-card' in s:
  s=s.replace('<article class="session-card reveal"','<article class="session-card reveal"')
  if p.name=='videos.html':
   s=s.replace('<div class="collection-toolbar">','''<div class="collection-controls"><div class="session-filters" role="group" aria-label="Sessions filtern"><button type="button" data-session-filter="all" aria-pressed="true">Alle Sessions</button><button type="button" data-session-filter="saved" aria-pressed="false">Gemerkte <span class="saved-count">0</span></button></div><label class="sort-label">Reihenfolge<select id="session-sort"><option value="newest">Neueste zuerst</option><option value="oldest">Älteste zuerst</option></select></label></div><div class="collection-toolbar">''')
   s=s.replace('Keine Session gefunden. Versuche eine andere Nummer.','Keine passende Session. Ändere die Suche oder zeige alle Sessions an. <button class="text-button reset-sessions" type="button">Alle anzeigen</button>')
   s=s.replace('</main>','<p class="container storage-note">Deine gemerkten Sessions bleiben nur in diesem Browser gespeichert.</p></main>')
 if 'booking-form' in s:
  s=s.replace('<p class="form-note">','''<details class="request-preview"><summary>Anfrage vor dem Versenden ansehen</summary><pre class="request-text">Fülle das Formular aus, um deine Anfrage hier zu prüfen.</pre></details><p class="form-note">''')
  s=s.replace('<div class="contact-direct">','<button class="text-button copy-email" type="button">E-Mail-Adresse kopieren</button><span class="sr-only email-copy-status" role="status"></span><div class="contact-direct">')
 # Portrait details open an accessible photo viewer; no false artist bios.
 s=re.sub(r'(<figure class="portrait [^"]+">)(<img[^>]+>)',r'\1<button class="portrait-open" type="button" aria-label="Porträt vergrößern">\2<span class="portrait-zoom" aria-hidden="true">↗</span></button>',s)
 s=s.replace('</main>', '''</main><dialog class="media-dialog" aria-labelledby="media-title"><div class="media-bar"><h2 id="media-title">Session ansehen</h2><button class="media-close" type="button" aria-label="Ansicht schließen">Schließen <span aria-hidden="true">×</span></button></div><div class="media-stage"></div><div class="media-bottom"><button class="media-prev" type="button" aria-label="Vorherige Session">← Zurück</button><p class="media-counter" aria-live="polite"></p><button class="media-next" type="button" aria-label="Nächste Session">Weiter →</button></div></dialog>''')
 # Additional useful direct links in footer.
 s=s.replace('<div class="footer-top">','<div class="footer-invitation"><a href="contact.html">Was habt ihr vor? <span aria-hidden="true">↗</span></a><p>Für Bookings und gemeinsame Ideen.</p></div><div class="footer-top">')
 p.write_text(s)
print('Creative enhancements applied to six pages.')
