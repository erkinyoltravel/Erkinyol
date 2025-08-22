# ErkinYol Travel — Next.js Landing

- RU / EN / 中文
- Light/Dark theme
- SEO meta + canonical erkinyol.com
- Form submit via /api/contact (SMTP or webhook), fallback mailto: info@erkinyol.com

## Quick start

```bash
npm i
npm run dev
# open http://localhost:3000
```

## ENV

Create `.env.local`:

```
CONTACT_TO=info@erkinyol.com
CONTACT_FROM=ErkinYol <no-reply@erkinyol.com>
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
# WEBHOOK_URL=https://your-crm-endpoint.example.com/hook
```

## Build & start

```bash
npm run build && npm start
```

## Tests

```bash
npm run test:unit
```

## Deploy (Vercel)

- Add domain `erkinyol.com`
- Add environment variables from `.env.local`
