# Deploying to Namecheap Domain with Netlify

This guide will help you connect your Namecheap domain (`helveticdynamics.com`) to your Netlify-hosted website.

## Option 1: Use Netlify Hosting (Recommended) ✅

Since your project uses Netlify serverless functions for email, this is the best option. You'll keep hosting on Netlify and point your Namecheap domain to it.

### Step 1: Deploy to Netlify (if not already done)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Netlify will auto-detect settings:
     - **Build command**: (leave empty - static site)
     - **Publish directory**: `.` (root)
   - Click "Deploy site"
   - Your site will be live at `https://your-site-name.netlify.app`

### Step 2: Configure Custom Domain in Netlify

1. In your Netlify site dashboard, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain: `helveticdynamics.com`
4. Netlify will also add `www.helveticdynamics.com` automatically
5. Netlify will show you DNS records to configure

### Step 3: Configure DNS in Namecheap

1. **Log in to Namecheap**
2. Go to **Domain List** → Click **Manage** next to `helveticdynamics.com`
3. Go to the **Advanced DNS** tab
4. **Remove existing A records** (if any)
5. **Add these DNS records**:

   **For root domain (helveticdynamics.com):**
   - Type: **A Record**
   - Host: `@`
   - Value: `75.2.60.5` (Netlify's IP - this may change, check Netlify dashboard)
   - TTL: Automatic

   **For www subdomain:**
   - Type: **CNAME Record**
   - Host: `www`
   - Value: `your-site-name.netlify.app` (replace with your actual Netlify URL)
   - TTL: Automatic

   **Alternative (Recommended):**
   - Instead of A record, you can use **ALIAS/ANAME** record if Namecheap supports it:
     - Type: **ALIAS Record** (or ANAME)
     - Host: `@`
     - Value: `your-site-name.netlify.app`
     - TTL: Automatic

6. **Save changes**

### Step 4: SSL Certificate (Automatic)

- Netlify will automatically provision an SSL certificate via Let's Encrypt
- This usually takes 1-24 hours after DNS propagation
- You can check status in Netlify → Domain management → HTTPS

### Step 5: Verify DNS Propagation

DNS changes can take 24-48 hours to propagate globally. Check status:

1. Use [whatsmydns.net](https://www.whatsmydns.net) to check DNS propagation
2. Or use terminal:
   ```bash
   dig helveticdynamics.com
   nslookup helveticdynamics.com
   ```

### Step 6: Update Environment Variables

Make sure your Netlify environment variables are set:

1. Go to Netlify → Site settings → Environment variables
2. Set these variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_EMAIL`: `info@helveticdynamics.com`
   - `RESEND_FROM_EMAIL`: `Website Kontaktformular <noreply@helveticdynamics.com>` (after domain verification)

### Step 7: Verify Domain in Resend

After your domain is live, verify it in Resend:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter: `helveticdynamics.com`
4. Add the DNS records Resend provides to Namecheap:
   - Go to Namecheap → Advanced DNS
   - Add the TXT record for domain verification
   - Add the MX record (if needed)
5. Wait for verification (usually a few minutes)
6. Update `RESEND_FROM_EMAIL` in Netlify to use your verified domain

---

## Option 2: Use Namecheap Hosting (Not Recommended)

⚠️ **Warning**: This option requires significant changes:
- You'll need to convert Netlify serverless functions to a different backend (Node.js server, Vercel, AWS Lambda, etc.)
- You'll need to set up SSL certificates manually
- More complex deployment process

If you still want to use Namecheap hosting:

1. **Upload files via FTP**:
   - Get FTP credentials from Namecheap
   - Upload all files except `netlify/` folder
   - You'll need to set up email functionality separately

2. **Set up email backend**:
   - Deploy the email function to a separate service (Vercel, AWS Lambda, etc.)
   - Update the API endpoint in `js/main.js`

**We strongly recommend Option 1 (Netlify + Namecheap domain).**

---

## Troubleshooting

### DNS Not Working
- Wait 24-48 hours for full propagation
- Clear your browser cache
- Try accessing via `www.helveticdynamics.com` first
- Check DNS records are correct in Namecheap

### SSL Certificate Issues
- Wait up to 24 hours after DNS propagation
- Ensure DNS is fully propagated before requesting SSL
- Check Netlify dashboard for SSL status

### Email Not Working
- Verify domain in Resend
- Check environment variables in Netlify
- Check Netlify function logs for errors

### Need Help?
- Netlify Support: [docs.netlify.com](https://docs.netlify.com)
- Namecheap Support: [support.namecheap.com](https://support.namecheap.com)
