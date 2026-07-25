# MovieMate v2 — Open Source Cinema Discovery & Watchlist Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)

**MovieMate v2** is a modern, open-source movie discovery, 5-star rating, watchlist management, and recommendation platform built with React, Vite, and server-side TMDB API integration.

Designed to be **100% free, hostable anywhere, with zero ads**.

---

## Key Features

- **Spotlight Hero & Trailers**: Embedded YouTube trailer player for instant video playback.
- **TMDB Integration**: Server-side TMDB API integration with zero browser setup needed.
- **5-Star Rating System**: Rate movies from 1 to 5 stars with personalized audience badges.
- **Managed Watchlists**: Categorize saved titles into *Want to Watch* vs *Already Watched*, with JSON backup import/export.
- **Smart Recommendations**: Taste match algorithm calculating compatibility scores based on user rating history.
- **Analytics Dashboard**: Statistics on watch duration, user average ratings, and genre distribution.
- **User & Admin Authentication**:
  - Regular User login & signup.
  - **Admin Control Panel**: 1-click TMDB Auto Import, custom movie entry form, catalog manager.

---

## Pre-Seeded Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@moviemate.com` | `admin123` |
| **Demo User** | `user@moviemate.com` | `user123` |

---

## 1-Click Free Public Deployment

### Option 1: Vercel (Recommended — Free, 0 Ads, Global CDN)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository. Vercel automatically detects Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your site is now live with free SSL (HTTPS) and zero ads!

### Option 2: Local Development (XAMPP / Node)
```bash
# 1. Clone repository
git clone https://github.com/your-username/moviemate-v2.git
cd moviemate-v2

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## License

This project is licensed under the **MIT License** — free for public use, modification, and deployment.
