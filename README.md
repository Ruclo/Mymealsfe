# MyMeals Frontend
React + Vite frontend for the MyMeals restaurant dashboard.

**Overview**
- Uses a relative `/api` base path for backend requests.
- In local dev, Vite proxies `/api` to `http://localhost:8080`.
- In Docker Compose, Caddy serves the built app and reverse-proxies `/api` to the backend.

**Requirements**
- Node.js 20+

**Run (Local)**
1. From `Mymealsfe`, install deps:
```bash
npm ci
```
2. Start the dev server:
```bash
npm run dev
```
3. Open the app from the Vite output (default `http://localhost:5173`).
4. Ensure the backend is running on `http://localhost:8080`.

**Run (Docker Compose)**
1. From the repo root, run:
```bash
docker compose up --build
```
2. The frontend is served by Caddy. By default it uses the host `chat.local`.
3. Add a hosts entry for `chat.local` or update `Mymealsfe/Caddyfile` to use `localhost`.

**Related**
- Root project: `../README.md`
- Backend: `../MyMeals/README.md`
