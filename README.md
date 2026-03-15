# Pa' Cabo Rojo 🌅

Hyperlocal real-time guide for Boquerón & Cabo Rojo, Puerto Rico.

Built with Next.js · TypeScript · Tailwind CSS · Vercel

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **Hosting:** Vercel
- **DNS:** Cloudflare → Namecheap domain
- **Fonts:** Bebas Neue, Libre Baskerville, Barlow (Google Fonts)

---

## Project Structure

```
app/
  page.tsx              ← Homepage (Today dashboard)
  playas/
    page.tsx            ← All beaches listing
    [slug]/page.tsx     ← Beach detail page
  layout.tsx            ← Root layout + fonts
  globals.css           ← CSS variables + animations

components/
  TopBar.tsx            ← Date bar + ES/EN language toggle
  Nameplate.tsx         ← Site masthead
  Ticker.tsx            ← Scrolling weather/conditions bar
  BottomNav.tsx         ← Fixed bottom navigation
  Providers.tsx         ← LangContext wrapper

lib/
  LangContext.tsx       ← Language state (ES/EN) with localStorage
  data.ts               ← All site content (beaches, events, restaurants, etc.)
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Vercel auto-detects Next.js — hit Deploy
4. Every push to `main` auto-deploys

### Connect your domain (when ready)

1. Buy domain on Namecheap (e.g. `pacaborojo.com`)
2. In Vercel: Settings → Domains → Add domain
3. In Cloudflare: Add CNAME record pointing to Vercel
4. Set Cloudflare proxy to **DNS only (grey cloud)** for SSL to work

---

## Adding Content

All content lives in `lib/data.ts`. No database needed yet.

- **Add a beach:** Add an entry to the `beaches` array
- **Add an event:** Add an entry to the `events` array  
- **Add a restaurant:** Add an entry to the `restaurants` array
- **Edit weather ticker:** Update text in `components/Ticker.tsx`

---

## Monetization Tiers

| Tier | What | Price |
|---|---|---|
| Basic Listing | Name, hours, link | Free |
| Featured | Top of list, photo, Tonight feed | $49/mo |
| Event Promo | Homepage push for the day | $25 |
| Tour/Lodging | Affiliate link in itineraries | 10% |

---

## Roadmap

- [ ] Tonight / full event calendar page
- [ ] Food & restaurants page  
- [ ] Map view (Mapbox)
- [ ] Business listing submission form
- [ ] Admin panel to update daily conditions
- [ ] Weather API integration (Open-Meteo)
- [ ] Google AdSense integration
