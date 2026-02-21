# How to Get Your Resend API Key

Follow these steps to get your Resend API key for the contact form.

## Step 1: Sign Up for Resend

1. Go to **https://resend.com**
2. Click **"Sign Up"** (top right corner)
3. You can sign up with:
   - **Email** (create an account)
   - **Google** (sign in with Google)
   - **GitHub** (sign in with GitHub)

## Step 2: Verify Your Email

1. Check your email inbox
2. Click the verification link from Resend
3. You'll be redirected back to Resend dashboard

## Step 3: Navigate to API Keys

1. Once logged in, you'll see the Resend dashboard
2. In the left sidebar, click on **"API Keys"**
   - Or go directly to: https://resend.com/api-keys

## Step 4: Create a New API Key

1. Click the **"Create API Key"** button (usually a blue button)
2. You'll see a form with:
   - **Name**: Give it a descriptive name (e.g., "Helvetic Dynamics Website" or "Contact Form")
   - **Permission**: Select **"Sending access"** (this is usually the default)
3. Click **"Add"** or **"Create API Key"**

## Step 5: Copy Your API Key

⚠️ **IMPORTANT:** This is the only time you'll see the full API key!

1. A modal will appear showing your API key
2. It will look something like: `re_123456789abcdefghijklmnop`
3. **Copy the entire key immediately** - you won't be able to see it again!
4. Store it somewhere safe (password manager, notes app, etc.)

## Step 6: Use Your API Key

You'll need this API key when setting up Netlify:

1. Go to your Netlify site settings
2. Navigate to **Environment variables**
3. Add a new variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Paste your copied API key
4. Save

## Free Tier Limits

Resend's free tier includes:
- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ API access
- ✅ Email logs and analytics

This should be more than enough for a contact form!

## Security Tips

1. **Never commit your API key to Git** - always use environment variables
2. **Don't share your API key** publicly
3. **Rotate your keys** if you suspect it's been compromised
4. **Use different keys** for different projects

## Troubleshooting

### Can't find API Keys section?
- Make sure you're logged in
- Check if you're on the correct dashboard page
- Try refreshing the page

### API key not working?
- Make sure you copied the entire key (no spaces before/after)
- Verify the key hasn't expired
- Check if you have the correct permissions

### Need to see your API key again?
- You can't! You'll need to create a new one
- Old keys will still work, but you can't view them again
- You can delete old keys and create new ones if needed

## Next Steps

Once you have your API key:
1. ✅ Deploy your site to Netlify
2. ✅ Add the API key as an environment variable
3. ✅ Test your contact form
4. ✅ Check your email inbox!

## Need Help?

- **Resend Documentation**: https://resend.com/docs
- **Resend Support**: Check their help center or contact support
- **Email Setup Guide**: See `EMAIL_SETUP.md` in this project
