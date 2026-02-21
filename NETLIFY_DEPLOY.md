# Deploy to Netlify - Quick Guide

Your code has been pushed to GitHub! Now let's deploy it to Netlify.

## Option 1: Deploy via Netlify Web Interface (Recommended)

### Step 1: Sign up/Login to Netlify
1. Go to https://app.netlify.com
2. Sign up or log in (you can use your GitHub account)

### Step 2: Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub account
4. Select your repository: `vetonshabani0/veton-website-01`

### Step 3: Configure Build Settings
Netlify should auto-detect these settings:
- **Build command:** (leave empty or `npm install`)
- **Publish directory:** `.` (root directory)
- **Base directory:** (leave empty)

Click **"Deploy site"**

### Step 4: Set Environment Variables
After the site starts deploying:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add these two variables:

   **Variable 1:**
   - Key: `RESEND_API_KEY`
   - Value: (Your Resend API key from https://resend.com)
   
   **Variable 2:**
   - Key: `CONTACT_EMAIL`
   - Value: `info@helveticdynamics.ch` (or your preferred email)

4. Click **"Save"**
5. Go back to **Deploys** tab
6. Click **"Trigger deploy"** → **"Clear cache and deploy site"** (to apply the new environment variables)

### Step 5: Wait for Deployment
- Netlify will build and deploy your site
- You'll get a URL like: `https://random-name-123.netlify.app`
- You can customize the domain name in **Site settings** → **Domain management**

## Option 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```
This will open your browser to authorize.

### Step 3: Initialize and Deploy
```bash
cd /Users/vetonshabani/Projects/helvetic-dynamics-01/veton-website-01
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose a team (or create one)
- Site name: (press enter for random name, or type your preferred name)
- Build command: (press enter - leave empty)
- Directory to deploy: `.` (press enter)

### Step 4: Set Environment Variables
```bash
netlify env:set RESEND_API_KEY "your-resend-api-key-here"
netlify env:set CONTACT_EMAIL "info@helveticdynamics.ch"
```

### Step 5: Deploy
```bash
netlify deploy --prod
```

## Verify Deployment

1. Visit your Netlify site URL
2. Go to the contact form
3. Fill it out and submit
4. Check your email inbox (the one set in `CONTACT_EMAIL`)

## Troubleshooting

### Functions not working?
1. Go to Netlify dashboard → **Functions** tab
2. Check for any errors in the function logs
3. Make sure environment variables are set correctly

### Email not sending?
1. Check Netlify function logs: **Functions** → **send-email** → **Logs**
2. Verify your Resend API key is correct
3. Check Resend dashboard for email logs: https://resend.com/emails

### Need to update the site?
Just push to GitHub - Netlify will automatically redeploy!

```bash
git add .
git commit -m "Your update message"
git push origin main
```

## Next Steps

1. **Custom Domain:** Add your domain in **Site settings** → **Domain management**
2. **HTTPS:** Automatically enabled by Netlify
3. **Custom Email Sender:** Verify your domain in Resend and update the sender email in `netlify/functions/send-email.js`

## Support

- **Netlify Docs:** https://docs.netlify.com
- **Resend Docs:** https://resend.com/docs
- **Netlify Status:** https://www.netlifystatus.com
