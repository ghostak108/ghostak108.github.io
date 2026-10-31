# ZweiKlang

Static, dependency-free website. GitHub Pages serves the repository root; the local working project keeps deployable output in `dist/`.

## Development

```sh
python3 build.py
python3 verify.py
node --check dist/app.js
node --check dist/creative.js
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

`build.py` creates all six pages from shared templates and the preserved source content in `source-reference/`. It then applies `humanize.py` (approved copy) and `evolve.py` (shared creative markup). CSS and JavaScript are maintained directly in `dist/`. Do not run the old one-off `update_portraits.py`; its work is incorporated into the templates.

## Current milestone

- Warm paper / forest / terracotta identity, large editorial opening and supplied sunset portraits (ghostak without headphones; artemis with headphones).
- Lightweight opening animations, scroll reveals, image drift and record motion. System reduced motion and a persistent browser-local pause control.
- Consent-gated native video dialog with previous/next controls, Escape handling, keyboard focus containment and external YouTube fallback.
- Local-only saved sessions, search, sort, reset and saved filter. No visitor profiles or analytics.
- Enlarged portraits, existing event category filters, email address copy and live booking request preview.
- Booking drafts addressed to zweiklangkontakt@gmail.com, with email-app, Gmail and copy alternatives. Visitors send the email themselves; no backend form submission.
- Original events, links and legal information retained. Source-reference is historical input, not additional current claims.

## Review and publishing

Production `main` must not be changed without Noah's explicit approval. Work on `design/creative-evolution` and present the local preview / draft PR first. Before publishing, copy the reviewed contents of `dist/` to the repository root while preserving existing repository assets.

See `qa/milestone.md` for the actual checks and remaining limits. Browser viewport tests are not real-device Safari tests.
