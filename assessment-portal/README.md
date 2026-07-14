# Field Services IT Skill Assessment

Web-based assessment portal for service desk / field services IT technicians.

## What it does

- Lets each technician select their name and complete a guided self-assessment.
- Adds scenario quiz questions for practical scoring.
- Produces a team scoring matrix by category.
- Shows category averages, submission status, strengths, and growth areas.

## Technicians included

- Dalton Tyler
- Tim Kay
- Justin Ward
- Justin Sokola
- Matthew Bouley
- Cameron Densmore
- Nyasia Torres
- Tony Luo

## Vercel deployment

This app is configured as a standard Next.js app.

1. Push this folder to GitHub.
2. Import the GitHub repository into Vercel.
3. Add Vercel KV / Upstash storage to the Vercel project.
4. Ensure these environment variables are present in Vercel:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
5. Deploy.

Without KV configured, the app still builds and runs, but submissions only use temporary in-memory storage and will not reliably persist across deployments or serverless instances.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```
