# EMA Crossover Backtester (Upstox) — Netlify version

Built for deploying entirely from a phone browser: GitHub upload + Netlify import,
no terminal, no app install.

## Deploy steps (all in your phone's browser)

1. Go to **github.com** → sign up / log in.
2. Tap **+** → **New repository** → give it any name → Create.
3. Tap **Add file → Upload files**, and upload all files/folders from this zip
   (`index.html`, `netlify.toml`, and the whole `netlify` folder with
   `functions/candles.js` inside it). Commit.
4. Go to **netlify.com** → sign up / log in with your GitHub account.
5. Tap **Add new site → Import an existing project → GitHub**, pick the repo you
   just created.
6. Leave build settings as default (no build command needed, publish directory
   is the repo root) → **Deploy site**.
7. Netlify gives you a live `.netlify.app` link — open it and use the backtester.

## Why this fixes "Failed to fetch"

Upstox blocks direct browser calls from other websites (CORS). The Netlify
Function in `netlify/functions/candles.js` runs on Netlify's servers, calls
Upstox from server to server (no CORS), and the page calls `/api/candles`
(same origin) which `netlify.toml` routes to that function.

## Using the page

1. Open the deployed link.
2. Paste today's Upstox access token (regenerate daily, expires ~3:30am).
3. Pick instrument, date range, EMA periods, SL/Target %, IV assumption, lot size.
4. Run backtest.

Note: option premiums are modeled with Black-Scholes using your assumed IV, not
real historical option prices — treat results as illustrative of signal timing,
not guaranteed real-world P&L.
