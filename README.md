# Boardroom — Multi-Brand CRM MVP

Interactive demo matching the client brief for a multi-brand CRM/database:

- **4 brand scopes** — filter and isolate leads/clients
- **Lead stages** — Lead → Active Pipeline → Active Client
- **Marketing cutoff** — emails auto-off when entering Active Pipeline
- **Automatic Client ID** — `CL-####` issued once on Active Client
- **Inverted Cross-Sell Search** — has Service X, missing Service Y
- **Dashboards** — pipeline, brand wins, service mix, isolation health

This MVP demonstrates the workflow in the browser. Production delivery is intended as a **SmartSuite** Solution using the same model.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Framework: **Next.js** (auto-detected).
4. Deploy — no env vars required.

```bash
npx vercel --yes
```

## Demo walkthrough for clients

1. Open **Dashboard** — review KPIs and brand isolation health.
2. Go to **Pipeline** — advance a Lead to Active Pipeline (marketing turns OFF), then to Active Client (Client ID appears).
3. Open **Clients** — toggle services on a client card.
4. Open **Cross-Sell** — filter “Has X / Missing Y” and show the opportunity list.
5. Use **Brand scope** in the header to prove records stay separated.
