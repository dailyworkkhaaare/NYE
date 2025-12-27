# Advanced Deployment Guide

This guide covers automating your deployment using **Netlify (via GitHub)** and deploying a containerized version to **Google Cloud Run**.

---

## Option 1: Netlify (Continuous Deployment via GitHub)
*Best for: Easy setup, automatic updates on every code push, free SSL.*

### Prerequisites
1.  A [GitHub](https://github.com/) account.
2.  A [Netlify](https://www.netlify.com/) account.
3.  Git installed on your machine.

### Step 1: Push Code to GitHub
If you haven't already initialized a repository:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit"

# Create a new repository on GitHub.com, then follow the instructions to push:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Connect Netlify
1.  Log in to your **Netlify Dashboard**.
2.  Click **"Add new site"** > **"Import an existing project"**.
3.  Select **GitHub**.
4.  Authorize Netlify to access your GitHub repositories.
5.  Search for and select the repository you created in Step 1.

### Step 3: Configure Build Settings
Netlify should automatically detect that this is a Vite project, but verify these settings:

*   **Build command**: `npm run build`
*   **Publish directory**: `dist`

Click **"Deploy site"**.

### Done!
Netlify will now build your site. Any time you push changes to the `main` branch on GitHub, Netlify will automatically rebuild and deploy the new version.

---

## Option 2: Google Cloud Run
*Best for: Scalability, enterprise control, paying only for usage, containerized workloads.*

We have added a `Dockerfile` and `nginx.conf` to your project to facilitate this.

### Prerequisites
1.  [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install) installed and authenticated.
2.  A Google Cloud Project with billing enabled.

### Step 1: Enable Services
Run the following commands in your terminal:

```bash
# Enable Container Registry and Cloud Run APIs
gcloud services enable containerregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com
```

### Step 2: Build and Submit the Container
This command bundles your code using the `Dockerfile`, builds it in the cloud, and stores the image in Google Container Registry (GCR).

Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/khaas-re-live
```

### Step 3: Deploy to Cloud Run
Once the build is complete, deploy the image:

```bash
gcloud run deploy khaas-re-live \
  --image gcr.io/YOUR_PROJECT_ID/khaas-re-live \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```
*(You can change `us-central1` to a region closer to your audience, e.g., `asia-south1` for Mumbai).*

### Done!
The command will output a Service URL (e.g., `https://khaas-re-live-xyz-uc.a.run.app`). Your app is now live and serverless.

---

## Which one should I use?

| Feature | Netlify (GitHub) | Google Cloud Run |
| :--- | :--- | :--- |
| **Ease of Setup** | Extremely Easy | Moderate (Requires CLI) |
| **Cost** | Free tier is generous | Pay-per-use (Free tier available) |
| **Updates** | Automatic (Git Push) | Manual (Run deploy command) or CI/CD setup required |
| **Tech Stack** | Static Hosting | Docker Container (Portability) |

**Recommendation:** Use **Netlify** for this specific event schedule app as it is faster to set up and requires zero maintenance. Use **Cloud Run** if you need to integrate it into a larger existing Google Cloud infrastructure.
