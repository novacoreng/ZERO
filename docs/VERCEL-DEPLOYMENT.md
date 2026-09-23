# ZERO Web — Vercel Deployment

The ZERO repository is a monorepo. The deployable web application is:

`apps/web`

It is a Next.js application and **is intended to be deployable on Vercel**.

## Required Vercel project settings

For the Vercel project connected to `novacoreng/ZERO`:

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** use the default detected install command
- **Node.js:** use a current supported Node.js version

Do not deploy the repository root as the ZERO web application. The repository root contains the platform packages, database migrations, security contracts, and other services; it is not itself the Next.js web root.

## Why the previous deployment returned 404

A deployment can successfully exist while the requested URL still returns Vercel's `NOT_FOUND` response when the project/deployment does not expose the intended application route. Vercel's documentation specifically recommends checking the deployment URL plus the Framework, Root Directory, Build Command, and Output Directory settings. For a monorepo, the Root Directory must point at the application being deployed.

## Verification

After changing the Root Directory:

1. Redeploy from `main`.
2. Confirm the build detects **Next.js**.
3. Confirm the build completes and produces the `/` route.
4. Open the resulting `.vercel.app` URL.
5. Test a hard refresh of `/`.
6. Only then configure a custom domain.

## Architecture note

Vercel is appropriate for the **ZERO web client**.

ZERO's security-sensitive backend, database, queues, object storage, cryptographic services, and operational infrastructure should be deployed as separately controlled services according to the production architecture and security gates. Do not put server-side private keys or message plaintext into the web deployment.

