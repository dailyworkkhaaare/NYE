# Netlify Deployment Guide: Manual Drag & Drop

Because this application uses **React** and **TypeScript** (Vite), you cannot simply drag the source code folder to Netlify. Browsers cannot read `.tsx` files directly.

You must **build** the project on your computer first, which creates a ready-to-use `dist` folder containing standard HTML, CSS, and JavaScript.

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed on your computer. Download it from [nodejs.org](https://nodejs.org/) (LTS version) if you haven't already.

## Step-by-Step Instructions

### 1. Install Dependencies
Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) inside the project folder and run:

```bash
npm install
```

### 2. Build the Project
Run the build command to compile your code:

```bash
npm run build
```

*   Once this completes, a new folder named **`dist`** will be created in your project directory.
*   This `dist` folder contains your actual website.

### 3. Drag and Drop to Netlify
1.  Open your web browser and go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  On your computer, navigate to your project folder.
3.  **Locate the `dist` folder.**
4.  **Drag and drop the `dist` folder** into the dashed area on the Netlify webpage.
    *   *Note: Do not drag the main project folder. Only drag the `dist` folder.*

Netlify will immediately upload and publish your live site.

## Updating the Site
If you make changes to the code:
1.  Run `npm run build` again.
2.  Drag the **new** `dist` folder to the "Deploys" tab in your Netlify dashboard.
