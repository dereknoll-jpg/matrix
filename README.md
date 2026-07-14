# Field Services IT Skill Assessment

Web-based assessment portal for service desk / field services IT technicians.

## What it does

- Lets each technician enter their assigned passcode and complete a guided self-assessment.
- Protects assessment access with unique technician passcodes.
- Protects the team matrix with a manager passcode.
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
- Derek Noll

## Vercel deployment

This app is configured as a standard Next.js app.

1. Push this repository to GitHub.
2. Import the GitHub repository into Vercel using the repository root.
3. Add Vercel KV / Upstash storage to the Vercel project.
4. Ensure these environment variables are present in Vercel:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `ADMIN_MATRIX_PASSCODE`
   - `TECH_PASSCODES_JSON`
5. Deploy.

Without KV configured, the app still builds and runs, but submissions only use temporary in-memory storage and will not reliably persist across deployments or serverless instances.

`TECH_PASSCODES_JSON` should be a JSON object whose keys exactly match technician names, for example:

```json
{
  "Dalton Tyler": "replace-with-passcode",
  "Tim Kay": "replace-with-passcode",
  "Derek Noll": "replace-with-passcode"
}
```

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
