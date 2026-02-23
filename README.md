# ZweiKlang – Website

Offizielle Website von **ZweiKlang**, einem DJ Duo aus Freiburg, das Melodic Afrohouse und Deep House spielt.

**Live-Domain:** [zweiklang.live](https://zweiklang.live)

---

## Projektübersicht

ZweiKlang (ghostak & artemis) ist ein DJ Duo aus Freiburg im Breisgau. Die Website präsentiert Musik, Videos, Events, Services und Kontaktmöglichkeiten für Booking-Anfragen.

---

## Ordnerstruktur

```
/
├── index.html          ← Hauptseite (Hero, Music, Videos, About, Events, Services, Contact)
├── about.html          ← Über uns / Das Duo
├── events.html         ← Upcoming Shows & Vergangene Highlights
├── videos.html         ← YouTube Videos & Showreels
├── contact.html        ← Kontakt, Impressum (#legal) & Datenschutz (#privacy)
├── 404.html            ← Fehlerseite
├── sitemap.xml         ← SEO Sitemap
├── robots.txt          ← Crawler-Anweisungen
├── CNAME               ← Custom Domain (zweiklang.live)
└── assets/
    ├── css/
    │   ├── variables.css   ← CSS Custom Properties (Farben, Fonts, Radien, Schatten)
    │   ├── base.css        ← CSS Reset, globale Styles, Typografie
    │   ├── components.css  ← Buttons, Cards, Pills, Badges, Forms, Cookie-Banner
    │   ├── layout.css      ← Header, Footer, Navigation, Grid-System, alle Media Queries
    │   └── animations.css  ← Reveal-Animationen, Tilt-Effekte, prefers-reduced-motion
    ├── js/
    │   └── main.js         ← Interaktivität (Navigation, Cookie-Banner, Animationen)
    └── img/
        ├── square_logo_colored.png  ← Haupt-Logo (farbig)
        ├── logo_black.png           ← Logo schwarz
        ├── banner_neu.png           ← Stage-Banner (groß)
        ├── small_banner.png         ← Banner klein
        ├── new_banner.png           ← Neues Banner
        ├── ghostak.png              ← Portrait ghostak
        ├── artemis.png              ← Portrait artemis
        ├── zweiklang.jpg            ← Duo-Foto
        ├── zweiklang_colored.png    ← Logo farbig (Variante)
        ├── transparent.png          ← Transparentes Bild
        └── youtube_symbol.png       ← YouTube Icon
```

---

## Inhalte ändern

### Events bearbeiten
Events sind direkt in `index.html` (Sektion `#events`) und `events.html` (Sektion `#upcoming` und `#past`) als HTML-Elemente eingetragen:

```html
<div class="event-card tilt">
  <p class="eyebrow" style="margin:0;">21 Okt 2025</p>
  <h3>Fili Cafe · Freiburg</h3>
  <p>Live Set All Night long mit Sven K.</p>
  <div class="meta-row">
    <span class="pill">21:00–02:30</span>
    <span class="pill">Freiburg i Br</span>
  </div>
</div>
```

Einfach Datum, Titel, Beschreibung und Uhrzeiten anpassen.

### Videos hinzufügen
Videos sind in `index.html` (Sektion `#watch`) und `videos.html` als Cards eingetragen. Neue YouTube-Video-ID einfügen:

```html
<a class="video-card tilt" href="https://www.youtube.com/watch?v=VIDEOID" target="_blank" rel="noopener noreferrer">
  <img src="https://i.ytimg.com/vi/VIDEOID/maxresdefault.jpg" alt="Titel" loading="lazy" />
  <div class="overlay" aria-hidden="true"></div>
</a>
```

`VIDEOID` durch die YouTube-Video-ID ersetzen.

### Texte ändern
Alle Texte stehen direkt in den HTML-Dateien. Kommentare wie `<!-- // SECTION_TITLE -->` helfen beim Auffinden der richtigen Stelle.

### CSS anpassen

| Datei | Zuständig für |
|-------|--------------|
| `assets/css/variables.css` | Farben, Abstände, Radien, Schatten – hier zentral ändern |
| `assets/css/base.css` | Reset, Body-Hintergrund, Typografie (h1–h5, p) |
| `assets/css/components.css` | Einzelne UI-Elemente: Buttons, Cards, Formulare, Cookie-Banner |
| `assets/css/layout.css` | Header, Footer, Navigation, Grid-Layouts, Media Queries |
| `assets/css/animations.css` | Fade-in Animationen, Tilt-Effekte, reduced-motion |

---

## Kontakt & Links

- **E-Mail:** zweiklangkontakt@gmail.com
- **Instagram:** https://www.instagram.com/zweiklang_music/
- **YouTube:** https://www.youtube.com/@zweiklang_music
- **SoundCloud:** https://soundcloud.com/zweiklang_music
