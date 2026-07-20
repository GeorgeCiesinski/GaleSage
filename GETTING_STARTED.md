```markdown
# Getting Started

## Requirements

- Node 22+

## Local Setup

1. Clone the Repository.
1. Run `npm install`.
1. Create an `.env` file in the root directory, and copy the contents of `.env.example` into it.
1. Add your Visual Crossing API key into `WEATHER_API_KEY` in the env file.

## Vercel Setup

1. Go to Vercel, connect to your github account, and import the Git Repository.
1. Go to vercel.com → Click your Project → Environment Variables.
1. Click Add Environment Variable.
1. Name the Key `WEATHER_API_KEY`, and paste your Visual Crossing API key into value.
1. Under environments, checkmark Production and Preview.
1. Click Save.

## Link Github Actions to Vercel (Automated Deployment)

In order for Github Actions to deploy to Vercel, you will need to add three secrets to Github.

**Note:** Production deploys are handled by GitHub Actions; `vercel.json` disables Vercel's auto-deploy on `main`.

### VERCEL_TOKEN

1. Go to vercel.com → top-right avatar → Settings → Tokens (or: https://vercel.com/account/tokens).
1. Under **Create Token**, set TOKEN NAME to `VERCEL_TOKEN` (or your preferred name), set SCOPE to your projects, and set EXPIRATION to your preferred duration. Copy this token immediately as Vercel only shows it once.

### VERCEL_ORG_ID

1. Go to vercel.com → Settings → stay on general and scroll down and copy the **Team ID** for later.

### VERCEL_PROJECT_ID

1. Go to vercel.com → Click your Project → Settings → Copy the project ID for later.

### Add to Github

1. Navigate to your repository.
1. Click Settings.
1. Under **Secrets and variables**, click Actions.
1. Click **New repository secret**, and create the secret VERCEL_TOKEN, pasting the token we created.
1. Repeat the last step, but name the second secret VERCEL_ORG_ID and paste the Team ID we copied.
1. Repeat the step once more, but name the final secret VERCEL_PROJECT_ID and paste the Project ID we copied.

# Development

- Run Vercel Dev environment with `npm run vercel`. Running the dev environment for the first time will prompt you to authenticate with Vercel and link the project.
- Run ESLint, Prettier, and TypeCheck with `npm run check`.
- Run the above checks as well as the Test Suite with `npm run validate`.
- Run `npm run test:watch` to run tests and watch for file changes. This is helpful for developing new tests.

**In case of issues:**

- Fix ESLint issues with `npm run lint:fix`.
- Fix Prettier issues with `npm run format:fix`.

# Production

This app uses Vite to build `/dist` files.

- First, validate files with `npm run validate`.
- Then build production files with `npm run build`.
- (Optional) Preview build with `npm run preview`.

**Note:** Build is automated during deployment. See CI/CD section below.
```
