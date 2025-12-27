# Advanced Deployment Guide: Vercel & Google Cloud Run

This guide explains how to deploy the **Khaas Re Live** app using modern cloud platforms.

---

## Option 1: Vercel (via GitHub)
*Best for: Speed, automatic previews, and global performance.*

### 1. Push Code to GitHub
Ensure your code is in a GitHub repository.
```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Connect to Vercel
1.  Log in to [vercel.com](https://vercel.com/).
2.  Click **"Add New"** > **"Project"**.
3.  Import your GitHub repository.
4.  **Framework Preset:** Vercel should auto-detect **Vite**. If not, select **Vite** from the dropdown.
5.  **Build Settings:**
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
6.  Click **"Deploy"**.

### 3. Environment Variables (Optional but Recommended)
For better security, you can move your Supabase keys to Vercel's "Environment Variables" section in the project settings and update `supabase.ts` to use `import.meta.env.VITE_SUPABASE_URL`.

---

## Option 2: Google Cloud Run
*Best for: Containerized workloads and full infrastructure control.*

This method uses the `Dockerfile` and `nginx.conf` provided in the project root.

### 1. Prerequisites
*   [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install) installed.
*   A Google Cloud Project with Billing enabled.

### 2. Build and Push to Artifact Registry
Replace `[PROJECT_ID]` with your actual Google Cloud Project ID.

```bash
# Enable required services
gcloud services enable artifactregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com

# Create a repository (if you don't have one)
gcloud artifacts repositories create khaas-repo --repository-format=docker --location=us-central1

# Build and submit via Cloud Build
gcloud builds submit --tag us-central1-docker.pkg.dev/[PROJECT_ID]/khaas-repo/show-flow:v1 .
```

### 3. Deploy to Cloud Run
```bash
gcloud run deploy khaas-re-live \
  --image us-central1-docker.pkg.dev/[PROJECT_ID]/khaas-repo/show-flow:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Why we use Nginx for Cloud Run?
Because this is a **Single Page Application (SPA)**, we use Nginx inside the container to handle routing. Without it, refreshing the page on a sub-route would result in a 404 error. The included `nginx.conf` redirects all traffic to `index.html`.
