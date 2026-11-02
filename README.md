# 🐔 Rosestar — Broiler Farm Management App

A clean, minimalist **React** web app for managing broiler poultry farms, inspired by Apple's design philosophy. Built with Vite + React.

## Features

- 📊 **Dashboard** — Live KPIs: FCR, ADG, EPEF, mortality rate
- ⚖️ **Weight Tracking** — Log and chart bird weights vs. breed benchmarks (Cobb 500 / Ross 308)
- 🌾 **Feed Management** — Track daily feed consumption and conversion
- 💊 **Health & Vaccination** — Log treatments, vaccinations, and health events
- 💀 **Mortality Tracking** — Record and visualize daily deaths
- 💰 **Finance** — Track expenses, sales, and profitability
- 📋 **Batch Reports** — Generate end-of-cycle performance reports
- 📱 **Mobile-first** — Responsive design with iOS-style bottom navigation

## Tech Stack

- **React 19** + **Vite 8**
- **Vanilla CSS** with CSS custom properties (no Tailwind)
- **Lucide React** for icons
- **Recharts** for data visualization
- **LocalStorage** for data persistence

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Build for Production

```bash
cd frontend
npm run build
```

## Project Structure

```
Rosestar/
├── frontend/
│   ├── public/           # Static assets & favicon
│   ├── src/
│   │   ├── components/   # UI components by feature
│   │   │   ├── Batch/
│   │   │   ├── Dashboard/
│   │   │   ├── Feed/
│   │   │   ├── Finance/
│   │   │   ├── Health/
│   │   │   ├── Landing/
│   │   │   ├── Layout/
│   │   │   ├── Modals/
│   │   │   ├── Mortality/
│   │   │   └── Weights/
│   │   ├── context/      # FarmContext (global state)
│   │   ├── data/         # Static data & breed benchmarks
│   │   └── utils/        # Calculations & helpers
│   └── package.json
└── README.md
```

## License

MIT
