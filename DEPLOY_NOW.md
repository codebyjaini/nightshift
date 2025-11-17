# 🚀 Deploy NightShift MD Now

Quick reference for immediate deployment.

## Prerequisites Check

- [ ] Supabase production project created
- [ ] Database schema created (run `supabase-setup.sql`)
- [ ] Storage bucket created (run `supabase-storage-setup.sql`)
- [ ] Production URL and anon key obtained

## 5-Minute Deploy to Vercel

```bash
# 1. Verify build
npm run build

# 2. Install Vercel CLI (if not installed)
npm install -g vercel

# 3. Login
vercel login

# 4. Deploy
vercel

# 5. Set environment variables
vercel env add VITE_SUPABASE_URL production
# Paste your Supabase URL

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your Supabase anon key

# 6. Deploy to production
vercel --prod
```

**Done!** Your app is live at the URL provided by Vercel.

## 5-Minute Deploy to Netlify

```bash
# 1. Verify build
npm run build

# 2. Install Netlify CLI (if not installed)
npm install -g netlify-cli

# 3. Login
netlify login

# 4. Initialize
netlify init

# 5. Set environment variables
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"

# 6. Deploy to production
netlify deploy --prod
```

**Done!** Your app is live at the URL provided by Netlify.

## Deploy via Dashboard (Even Easier!)

### Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click "Deploy"

### Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click "Deploy site"

## After Deployment

### Test These Critical Flows

1. **Patient Submission**
   - Go to your deployed URL
   - Click "I'm a Patient"
   - Fill out triage form
   - Submit successfully

2. **Doctor Dashboard**
   - Go to your deployed URL
   - Click "I'm a Doctor"
   - See patient list
   - Click patient to view details
   - Mark as treated

3. **Real-time Updates**
   - Open dashboard in two tabs
   - Submit patient in one tab
   - See it appear in other tab

### Performance Check

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Target: 90+ for all scores

## Troubleshooting

### Build Fails
```bash
# Check locally first
npm run build

# Fix any errors, then redeploy
```

### "Failed to fetch" Error
- Check environment variables are set correctly
- Verify Supabase URL and anon key
- Check Supabase project is not paused

### Images Not Loading
- Verify storage bucket is public
- Check CORS settings in Supabase

## Need Help?

- 📖 [Quick Deploy Guide](./QUICK_DEPLOY.md)
- 📋 [Production Checklist](./PRODUCTION_CHECKLIST.md)
- ✅ [Post-Deployment Testing](./POST_DEPLOYMENT_CHECKLIST.md)
- 📚 [Full Deployment Guide](./DEPLOYMENT.md)

## Emergency Rollback

### Vercel
```bash
vercel rollback [deployment-url]
```

### Netlify
1. Go to Deploys
2. Find previous working deployment
3. Click "Publish deploy"

---

**Ready to deploy?** Run `npm run predeploy` to verify everything is ready!
