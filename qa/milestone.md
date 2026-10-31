# Creative evolution — 2026-11-01

Verified locally with the in-app browser:

- All 6 pages at widths 320, 390, 768 and 1440 px: no horizontal document overflow; no failed completed images observed.
- Inspected screenshots of desktop opening, iPhone-size opening, video dialog and expanded booking preview.
- Native mobile menu opens with close-button focus; Escape closes it.
- Saved session filter shows one selected item and survives page navigation.
- Search empty state, reset and oldest-first ordering work.
- Video modal opens, next-session navigation works, and Escape removes embedded content. The consent action creates a youtube-nocookie iframe with autoplay=0.
- Event category “Draußen” shows Mondhalde only.
- Booking preview reflects entered values and addresses zweiklangkontakt@gmail.com. No test request sent.
- Pause control activates motion-paused mode and persists across navigation after asset cache invalidation. CSS explicitly supports system reduced motion.
- HTML validator: 6 pages, 233 links, local assets, unique IDs, one H1, native dialogs and 11 sessions.
- Node syntax checks pass for both scripts. Build is reproducible without packages.

Limits: actual Safari/iPhone hardware, complete screen-reader navigation and field Core Web Vitals have not been measured. No Lighthouse score is claimed. External video/audio playback requires the user's click and platform availability. The email flow opens a draft; it does not directly submit to a server.

Production remains at 79dd479 until approval. The prior prepared commit 68ae6b6 was never promoted to main.
