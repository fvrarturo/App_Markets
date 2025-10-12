# 🚂 Deploy Your Markets Dashboard to Railway

## Step 1: Push Your Code to GitHub

### 1.1 Create a GitHub Account (if you don't have one)
Go to https://github.com and sign up

### 1.2 Create a New Repository
1. Go to https://github.com/new
2. Name it: `markets-dashboard`
3. Set to **Private** (recommended for API keys)
4. DON'T initialize with README (we already have code)
5. Click "Create repository"

### 1.3 Push Your Code to GitHub

Run these commands in your terminal:

```bash
cd /Users/arturofavara/Desktop/App_Markets

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Markets Dashboard"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/markets-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### 2.2 Deploy Your App

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"markets-dashboard"** from the list
4. Railway will automatically detect and deploy!

### 2.3 Configure Environment (Optional)
If you need any environment variables:
1. Click on your deployed service
2. Go to "Variables" tab
3. Add any needed variables

### 2.4 Get Your Live URL
1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. You'll get a URL like: `https://markets-dashboard-production.up.railway.app`

## Step 3: Update Frontend to Use Railway Backend

Once deployed, update your frontend to use the Railway URL:

```bash
cd /Users/arturofavara/Desktop/App_Markets/frontend
```

Create a `.env` file:
```bash
VITE_API_URL=https://your-app-name.up.railway.app
```

Update your API calls to use this URL instead of localhost.

## Step 4: Test Your Deployment

Visit your Railway URL in a browser - you should see your backend running!

Try these endpoints:
- `https://your-app.railway.app/api/equities`
- `https://your-app.railway.app/api/rates`
- `https://your-app.railway.app/api/macro`

## 🎉 Done!

Your backend is now:
- ✅ Running 24/7 in the cloud
- ✅ Accessible from anywhere
- ✅ Ready for your iPhone app!

## Troubleshooting

### Build fails?
Check the logs in Railway dashboard to see what went wrong.

### Need to update code?
Just push to GitHub and Railway auto-deploys:
```bash
git add .
git commit -m "Update"
git push
```

### Costs?
Railway free tier includes:
- $5 credit per month
- Usually enough for personal projects
- They'll email you if you're running low

## Next: Convert Frontend to iOS App

See `IOS_APP_SETUP.md` for converting your React app to a native iOS app with Capacitor!

