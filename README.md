# ParallarXiv

This repository contains the base framework for a Next.js website that will visualize arXiv papers. The project is prepared for deployment to Vercel.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
npm start
```

## Vercel configuration

1. **Project Settings**
   - Connect this repository to Vercel.
   - Set the **Framework Preset** to **Next.js**.
   - The build command is `npm run build` and the output directory is `.next`.
   - Set the install command to `npm install` (or leave blank for Vercel default).

2. **Environment Variables**
   - Add any variables needed for fetching from the arXiv API.

3. **Deploy**
   - Push to the `main` or a feature branch. Vercel automatically builds and deploys.
   - Visit the deployed URL to verify you see the placeholder message.

## Merge conflict resolution

This repository uses a custom `theirs` merge driver to automatically resolve conflicts in favor of the merging branch. The `.gitattributes` file configures this driver for all files. Configure the driver with:

```bash
git config merge.theirs.driver "./scripts/theirs-driver.sh %O %A %B"
```


