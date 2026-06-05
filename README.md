# Io Sono Ghizzo Live — Sito ufficiale (fan-style)

Sito statico per il lancio dell'album **"Io Sono Ghizzo Live"** (6 giugno 2026).

## Stack

- **HTML + CSS + JavaScript vanilla** — zero build, zero dipendenze locali
- **Firebase Firestore** per il Wall (messaggi realtime condivisi tra tutti i visitatori)
- Font: Bebas Neue + Inter (Google Fonts)
- Mobile-first, responsive desktop/tablet/smartphone

## Struttura

```
site/
├── index.html
├── css/styles.css
├── js/app.js
├── firestore.rules        # regole di sicurezza per il Wall
└── assets/img/            # foto di Ghizzo
```

## Sezioni del sito

1. **Home / Nuovo Album** — hero + countdown alla mezzanotte del 6 giugno
2. **Tracklist** — click su un brano = modal con testo + link Suno
3. **Discografia** — "Io Sono Ghizzo Live" (2026) + "Ghizzo Fluo" (2025)
4. **Rassegna Stampa** — 6 articoli/interviste *inventati*
5. **Chi Sono** — bio + tour 2026 (date inventate)
6. **Wall** — bacheca di post-it con persistenza Firebase

---

## Eseguire in locale

Per via dei moduli ES6 di Firebase, **non** puoi aprire `index.html` con doppio click (CORS). Avvia un server statico:

```powershell
# dalla cartella site/
python -m http.server 5500
# poi apri http://localhost:5500
```

Alternativa: estensione **"Live Server"** in VS Code (click destro su `index.html` → *Open with Live Server*).

---

## Deploy su GitHub Pages

1. Crea un repo nuovo su GitHub (es. `io-sono-ghizzo-live`)
2. Dalla cartella `ProgettoGhizzo/`:
   ```powershell
   cd site
   git init
   git add .
   git commit -m "Initial release"
   git branch -M main
   git remote add origin https://github.com/TUO_USERNAME/io-sono-ghizzo-live.git
   git push -u origin main
   ```
3. Su GitHub: **Settings → Pages → Branch: `main` / `/ (root)` → Save**
4. Dopo ~1 minuto il sito è online su `https://TUO_USERNAME.github.io/io-sono-ghizzo-live/`

> **Nota**: pubblica solo il contenuto della cartella `site/`. La cartella `Materiale/` non deve finire nel repo pubblico.

---

## Firebase / Firestore — IMPORTANTE

La config attuale è in chiaro dentro `js/app.js`. **Le chiavi Firebase web sono pubbliche per design**, ma la sicurezza dipende dalle Firestore Rules.

### Passi obbligatori prima del lancio

1. **Imposta le regole di sicurezza**:
   - Firebase Console → Firestore Database → tab **Rules**
   - Incolla il contenuto di `firestore.rules` e clicca **Publish**
   - Senza queste regole, la modalità "test" di Firestore **scade dopo 30 giorni** e il Wall smette di funzionare.

2. **(Consigliato) Restringi la chiave API ai tuoi domini**:
   - Google Cloud Console → APIs & Services → Credentials → la tua API key Browser
   - HTTP referrers → aggiungi `https://TUO_USERNAME.github.io/*` (e localhost per dev)
   - Questo evita che la chiave venga abusata da altri siti.

3. **(Opzionale) Moderazione**:
   - Le regole consentono solo `create`, non `update/delete` dal client
   - Per cancellare messaggi offensivi: Firebase Console → Firestore → collection `wall` → delete manuale

---

## Modificare i contenuti

Tutti i dati testuali sono in **`js/app.js`** in cima al file:

- `RELEASE_DATE` — data di uscita per il countdown
- `LYRICS` — testi delle canzoni
- `NEW_ALBUM` / `OLD_ALBUM` — tracklist + link Suno
- `PRESS` — articoli rassegna stampa
- `TOUR` — date del tour

La bio di "Chi Sono" è in `index.html` (sezione `<section id="bio">`).

---

## Crediti

- Musica: Ghizzo
- Foto: archivio personale
- Articoli stampa: contenuti dimostrativi, fittizi
- Date tour: fittizie
