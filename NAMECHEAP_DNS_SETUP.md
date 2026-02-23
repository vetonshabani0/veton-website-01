# Namecheap DNS Setup for Netlify - Quick Guide

## Step-by-Step Instructions

### 1. Get DNS Records from Netlify

1. In Netlify dashboard, go to **Domain management**
2. Click on **"Pending DNS verification"** or the domain `helveticdynamics.com`
3. You'll see the DNS records you need to add - **copy these values**

### 2. Configure DNS in Namecheap

1. **Log in to Namecheap**: [namecheap.com](https://www.namecheap.com)
2. Go to **Domain List** (top menu)
3. Find `helveticdynamics.com` and click **Manage**
4. Go to the **Advanced DNS** tab

### 3. Remove Old Records (if any)

- Look for any existing **A Records** or **CNAME Records** pointing to other services
- Delete them (click the trash icon)

### 4. Add Netlify DNS Records

Netlify will show you records like this. Add them exactly as shown:

#### For Root Domain (helveticdynamics.com):

**Option A: A Record (if Netlify shows an IP address)**
- Click **Add New Record**
- Type: **A Record**
- Host: `@`
- Value: `75.2.60.5` (or the IP Netlify shows you)
- TTL: **Automatic** (or 30 min)
- Click **Save** (green checkmark)

**Option B: ALIAS Record (Recommended - if Namecheap supports it)**
- Click **Add New Record**
- Type: **ALIAS Record** (or **ANAME Record**)
- Host: `@`
- Value: `your-site-name.netlify.app` (your actual Netlify site URL)
- TTL: **Automatic**
- Click **Save**

#### For www Subdomain:

- Click **Add New Record**
- Type: **CNAME Record**
- Host: `www`
- Value: `your-site-name.netlify.app` (your actual Netlify site URL)
- TTL: **Automatic**
- Click **Save**

### 5. Verify Your Records

Your Advanced DNS should look like this:

```
Type    Host    Value                          TTL
A       @       75.2.60.5                      Automatic
CNAME   www     your-site-name.netlify.app     Automatic
```

OR (if using ALIAS):

```
Type    Host    Value                          TTL
ALIAS   @       your-site-name.netlify.app     Automatic
CNAME   www     your-site-name.netlify.app     Automatic
```

### 6. Wait for DNS Propagation

- DNS changes can take **15 minutes to 48 hours** to propagate
- Usually works within **1-2 hours**
- Netlify will automatically detect when DNS is configured correctly

### 7. Check Status in Netlify

1. Go back to Netlify → Domain management
2. The status should change from "Pending" to "Active" once DNS propagates
3. Netlify will automatically provision SSL certificate (takes 1-24 hours after DNS is active)

### 8. SSL Certificate Provisioning

**Important**: After DNS is configured, Netlify automatically provisions SSL certificates. This process:
- Starts automatically once DNS is verified
- Usually takes **1-24 hours** (often completes within 2-4 hours)
- You'll see "SSL certificate provisioning" status in Netlify

**While waiting for SSL certificate:**
- You may see security warnings in browsers (this is normal)
- The site may not be accessible via HTTPS yet
- Netlify will email you when the certificate is ready

## Troubleshooting

### DNS Not Updating?

1. **Wait at least 15 minutes** after making changes
2. Clear your browser cache
3. Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net/#A/helveticdynamics.com)
4. Verify records in Namecheap match exactly what Netlify shows

### Still Showing "Pending"?

- Double-check the values match exactly (no extra spaces, correct capitalization)
- Make sure you saved the records in Namecheap
- Try accessing `www.helveticdynamics.com` first (CNAME usually propagates faster)

### SSL Certificate Error (NET::ERR_CERT_COMMON_NAME_INVALID)?

**This is normal during setup!** You're seeing this because:

1. **DNS is configured** ✅ (the error shows it's reaching your domain)
2. **SSL certificate is still provisioning** ⏳ (Netlify needs time to issue it)

**What to do:**
1. **Check Netlify Dashboard**:
   - Go to **Domain management** → `helveticdynamics.com`
   - Look for "SSL certificate" status
   - It should say "Provisioning" or "Pending"

2. **Wait for certificate**:
   - Usually takes **1-4 hours** after DNS is verified
   - Can take up to **24 hours** in some cases
   - Netlify will email you when ready

3. **Verify DNS is correct**:
   - Make sure you removed conflicting records
   - Check that DNS shows as "Active" in Netlify
   - Use [whatsmydns.net](https://www.whatsmydns.net) to verify propagation

4. **Once certificate is ready**:
   - The security warning will disappear
   - Your site will work with HTTPS
   - Both `helveticdynamics.com` and `www.helveticdynamics.com` will work

**You can check certificate status in Netlify:**
- Go to **Site settings** → **Domain management**
- Click on your domain
- Look for "HTTPS" or "SSL" section

### Need the Exact Values?

**Check your Netlify dashboard** - it will show you the exact records to add. The values above are examples - your actual Netlify site URL will be different.

## Quick Reference

- **Namecheap Login**: [namecheap.com](https://www.namecheap.com)
- **Netlify Dashboard**: [app.netlify.com](https://app.netlify.com)
- **DNS Checker**: [whatsmydns.net](https://www.whatsmydns.net)
