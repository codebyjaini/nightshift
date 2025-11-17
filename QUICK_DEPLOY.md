# Quick Deployment Guide

Choose your preferred hosting platform and follow the steps below.

## Prerequisites

✅ Production build tested locally (`npm run build && npm run preview`)
✅ Supabase production project configured
✅ Environment variables ready

## Deploy to Vercel (Recommended)

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app is live! 🎉

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment (will ask configuration questions)
   vercel
   
   # Follow prompts:
   # - Set up and deploy? Yes
   # - Which scope? (select your account)
   # - Link to existing project? No
   # - Project name? nightshift-md (or your choice)
   # - Directory? ./ (press Enter)
   # - Override settings? No
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL production
   # Paste your Supabase URL when prompted
   
   vercel env add VITE_SUPABASE_ANON_KEY production
   # Paste your Supabase anon key when prompted
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

6. **Your app is live!** 🎉
   - Vercel will provide a URL like: `https://nightshift-md.vercel.app`

### Vercel: Add Custom Domain

```bash
# Via CLI
vercel domains add yourdomain.com

# Or via Dashboard
# 1. Go to Project Settings → Domains
# 2. Add your domain
# 3. Update DNS records as instructed
```

## Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select repository
   - Netlify will auto-detect build settings from `netlify.toml`

3. **Configure Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy site"
   - Wait 1-2 minutes
   - Your app is live! 🎉

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   
   # Follow prompts:
   # - Create & configure a new site
   # - Team: (select your team)
   # - Site name: nightshift-md (or your choice)
   # - Build command: npm run build
   # - Directory: dist
   # - Netlify functions: (skip)
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_SUPABASE_URL "your_supabase_url"
   netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
   ```

5. **Deploy**
   ```bash
   # Deploy to production
   netlify deploy --prod
   ```

6. **Your app is live!** 🎉
   - Netlify will provide a URL like: `https://nightshift-md.netlify.app`

### Netlify: Add Custom Domain

```bash
# Via CLI
netlify domains:add yourdomain.com

# Or via Dashboard
# 1. Go to Domain settings
# 2. Add custom domain
# 3. Update DNS records as instructed
```

## Deploy via GitHub Actions (Automatic)

If you've pushed the `.github/workflows/ci.yml` file:

1. **Enable GitHub Actions**
   - Go to your GitHub repository
   - Click "Actions" tab
   - Enable workflows if prompted

2. **Connect to Vercel/Netlify**
   - Both platforms automatically deploy on push to main branch
   - No additional configuration needed if you used Option A above

3. **Automatic Deployments**
   - Every push to `main` → Production deployment
   - Every pull request → Preview deployment

## Post-Deployment

### 1. Verify Deployment

```bash
# Run post-deployment checklist
# Open POST_DEPLOYMENT_CHECKLIST.md and test each item
```

### 2. Test Critical Flows

- [ ] Submit a test patient
- [ ] View patient in doctor dashboard
- [ ] Mark patient as treated
- [ ] Verify real-time updates work

### 3. Check Performance

```bash
# Run Lighthouse audit
# 1. Open deployed site in Chrome
# 2. Open DevTools (F12)
# 3. Go to Lighthouse tab
# 4. Run audit
# Target: 90+ for all scores
```

### 4. Monitor Errors

- Check browser console for errors
- Check Vercel/Netlify logs for build errors
- Check Supabase logs for database errors

## Continuous Deployment

### Vercel
- Automatic deployments on push to main
- Preview deployments for pull requests
- View deployments: `vercel ls`

### Netlify
- Automatic deployments on push to main
- Preview deployments for pull requests
- View deployments: `netlify sites:list`

## Rollback

### Vercel
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]

# Or via Dashboard:
# 1. Go to Deployments
# 2. Find working deployment
# 3. Click "..." → "Promote to Production"
```

### Netlify
```bash
# Via Dashboard:
# 1. Go to Deploys
# 2. Find working deployment
# 3. Click "Publish deploy"
```

## Troubleshooting

### Build Fails

**Error**: TypeScript errors
```bash
# Fix locally first
npm run build
# Fix all errors, then redeploy
```

**Error**: Missing dependencies
```bash
# Ensure package.json is committed
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Runtime Errors

**Error**: "Failed to fetch"
- Check environment variables are set correctly
- Verify Supabase URL and anon key
- Check Supabase project is not paused

**Error**: Images not loading
- Verify storage bucket is public
- Check CORS settings in Supabase

**Error**: Real-time not working
- Verify real-time is enabled for patients table
- Check WebSocket connection in browser console

### Environment Variables Not Working

```bash
# Vercel: Redeploy after adding env vars
vercel --prod

# Netlify: Redeploy after adding env vars
netlify deploy --prod
```

## Cost Estimates

### Free Tier Limits

**Vercel (Hobby)**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- **Cost**: Free

**Netlify (Starter)**
- 100GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS
- **Cost**: Free

**Supabase (Free)**
- 500MB database
- 1GB file storage
- 2GB bandwidth
- **Cost**: Free

### When to Upgrade

- **High traffic**: Upgrade Vercel/Netlify for more bandwidth
- **Large database**: Upgrade Supabase for more storage
- **Team features**: Upgrade for collaboration tools

## Support

### Vercel
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)

### Netlify
- Docs: [docs.netlify.com](https://docs.netlify.com)
- Support: [netlify.com/support](https://netlify.com/support)

### Supabase
- Docs: [supabase.com/docs](https://supabase.com/docs)
- Support: [supabase.com/support](https://supabase.com/support)

## Next Steps

1. ✅ Deploy to production
2. ✅ Test with POST_DEPLOYMENT_CHECKLIST.md
3. ✅ Add custom domain (optional)
4. ✅ Set up monitoring (optional)
5. ✅ Enable analytics (optional)
6. 🔜 Implement authentication for doctor dashboard
7. 🔜 Enable Row Level Security in Supabase
8. 🔜 Add automated testing in CI/CD

---

**Need help?** Check DEPLOYMENT.md for detailed instructions.
