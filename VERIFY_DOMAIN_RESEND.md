# How to Use Your Own Domain Email with Resend

By default, the contact form uses `info@helveticdynamics.ch` as the sender. To make it work properly and avoid emails going to spam, you should verify your domain in Resend.

## Option 1: Verify Your Domain (Recommended)

This allows you to send emails from your own domain (e.g., `noreply@helveticdynamics.ch`).

### Step 1: Add Domain in Resend

1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain: `helveticdynamics.ch` (or `helveticdynamics.com`)
4. Click **"Add"**

### Step 2: Add DNS Records

Resend will show you DNS records to add. You need to add these to your domain's DNS settings:

**Example records (yours will be different):**
```
Type: TXT
Name: _resend
Value: resend-domain-verification=abc123...

Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
```

### Step 3: Add DNS Records to Your Domain

1. Log in to your domain registrar (where you bought helveticdynamics.ch)
2. Go to DNS settings
3. Add the records Resend provided
4. Save changes

### Step 4: Wait for Verification

- DNS changes can take a few minutes to 24 hours
- Resend will automatically verify your domain
- You'll see a green checkmark when verified

### Step 5: Update Environment Variable in Netlify

Once verified, add this environment variable in Netlify:

1. Go to Netlify → Site settings → Environment variables
2. Add new variable:
   - **Key**: `RESEND_FROM_EMAIL`
   - **Value**: `Website Kontaktformular <noreply@helveticdynamics.ch>`
3. Save
4. Redeploy your site

## Option 2: Use Default Email (Quick Start)

If you haven't verified your domain yet, the function will use `info@helveticdynamics.ch` by default.

**Note:** Without domain verification, emails might:
- Go to spam folders
- Be rejected by some email providers
- Show "via resend.dev" in some email clients

## Option 3: Use Resend's Default Domain (Temporary)

If you want to test immediately without domain verification:

1. In Netlify, add environment variable:
   - **Key**: `RESEND_FROM_EMAIL`
   - **Value**: `Website Kontaktformular <onboarding@resend.dev>`
2. This works immediately but emails may go to spam

## Recommended Setup

For best results:

1. ✅ Verify your domain in Resend
2. ✅ Set `RESEND_FROM_EMAIL` to use your verified domain
3. ✅ Use a subdomain like `noreply@helveticdynamics.ch` or `contact@helveticdynamics.ch`

## Current Default Behavior

The function now defaults to `info@helveticdynamics.ch`. If you haven't verified your domain:
- Resend will try to send from this address
- It might fail or go to spam
- You'll see errors in Netlify function logs

**Solution:** Verify your domain or use `onboarding@resend.dev` temporarily.

## Check Domain Status

1. Go to https://resend.com/domains
2. Check if your domain shows as "Verified" (green checkmark)
3. If not verified, check your DNS records are correct

## Troubleshooting

### "Domain not verified" error?
- Check DNS records are added correctly
- Wait 24 hours for DNS propagation
- Verify records match exactly what Resend provided

### Emails going to spam?
- Verify your domain (adds SPF/DKIM records)
- Use a verified domain email address
- Don't use `onboarding@resend.dev` in production

### Can't add DNS records?
- Contact your domain registrar support
- They can help you add the records
- Or use a DNS provider like Cloudflare

## Next Steps

1. Verify your domain in Resend
2. Set `RESEND_FROM_EMAIL` environment variable in Netlify
3. Test the contact form
4. Check that emails arrive properly
