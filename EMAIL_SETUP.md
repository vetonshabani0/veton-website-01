# Email Setup with Resend

This guide will help you set up the contact form to send emails using Resend.

## Prerequisites

1. A Resend account (sign up at https://resend.com)
2. A Resend API key
3. Netlify account (for deploying serverless functions) OR Vercel account

## Step 1: Get Your Resend API Key

1. Go to https://resend.com and sign up/login
2. Navigate to **API Keys** in your dashboard
3. Click **Create API Key**
4. Give it a name (e.g., "Helvetic Dynamics Website")
5. Copy the API key (you'll need it in Step 3)

## Step 2: Verify Your Domain (Optional but Recommended)

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `helveticdynamics.ch`)
4. Add the DNS records provided by Resend to your domain's DNS settings
5. Wait for verification (can take a few minutes to 24 hours)

**Note:** If you don't verify a domain, you can use `onboarding@resend.dev` as the sender, but emails might go to spam.

## Step 3: Install Dependencies

```bash
npm install
```

This will install the `resend` package needed for the serverless function.

## Step 4: Deploy to Netlify

### Option A: Deploy via Netlify

1. Push your code to GitHub
2. Go to https://app.netlify.com
3. Click **New site from Git**
4. Connect your GitHub repository
5. Build settings:
   - Build command: (leave empty or `npm install`)
   - Publish directory: `.` (root)
6. Click **Deploy site**

### Option B: Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Step 5: Set Environment Variables in Netlify

1. In your Netlify dashboard, go to **Site settings**
2. Click **Environment variables**
3. Add the following variables:

   - **RESEND_API_KEY**: Your Resend API key from Step 1
   - **CONTACT_EMAIL**: The email address where you want to receive contact form submissions (e.g., `info@helveticdynamics.ch`)

4. Click **Save**

## Step 6: Update the Sender Email (Optional)

If you verified your domain in Step 2, update the sender email in `netlify/functions/send-email.js`:

```javascript
from: 'Website Kontaktformular <noreply@helveticdynamics.ch>', // Use your verified domain
```

Replace `helveticdynamics.ch` with your actual domain.

## Step 7: Test the Contact Form

1. Visit your deployed website
2. Fill out the contact form
3. Submit it
4. Check your email inbox (the one set in `CONTACT_EMAIL`)

## Alternative: Using Vercel

If you prefer Vercel instead of Netlify:

1. Create `api/send-email.js` (similar to the Netlify function)
2. Deploy to Vercel
3. Set environment variables in Vercel dashboard
4. Update the API URL in `js/main.js` to `/api/send-email`

## Troubleshooting

### Emails not sending?

1. Check Netlify function logs:
   - Go to Netlify dashboard → **Functions** → **send-email**
   - Check for error messages

2. Verify environment variables are set correctly

3. Check Resend dashboard for email logs and errors

4. Make sure your Resend API key is valid and not expired

### Emails going to spam?

1. Verify your domain in Resend (Step 2)
2. Update the sender email to use your verified domain
3. Add SPF and DKIM records (provided by Resend)

## Security Notes

- Never commit your API keys to Git
- Always use environment variables for sensitive data
- The serverless function includes CORS headers for cross-origin requests
- Input validation is performed on both client and server side

## Support

For issues with:
- **Resend**: Check https://resend.com/docs
- **Netlify Functions**: Check https://docs.netlify.com/functions/overview/
- **This implementation**: Check the function logs in Netlify dashboard
