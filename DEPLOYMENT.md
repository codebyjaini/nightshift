# Deployment Guide

This guide covers deploying NightShift MD to production using Vercel or Netlify.

## Prerequisites

- Supabase project with production database configured
- GitHub repository (for automatic deployments)
- Vercel or Netlify account

## Environment Variables

The following environment variables must be configured in your hosting platform:

```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

**Important**: Never commit actual credentials to version control. Use the hosting platform's environment variable management.

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

#### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add environment variables:
   - Go to "Environment Variables" section
   - Add `VITE_SUPABASE_URL` with your production Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your production anon key

6. Click "Deploy"

#### Step 3: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

### Option 2: Deploy to Netlify

#### Step 1: Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider and select repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Add environment variables:
   - Go to "Site settings" → "Environment variables"
   - Add `VITE_SUPABASE_URL` with your production Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your production anon key

6. Click "Deploy site"

#### Step 2: Configure Custom Domain (Optional)

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Supabase Production Configuration

### Database Setup

1. Ensure your production Supabase project has the schema created:
   ```bash
   # Run the SQL scripts in your Supabase SQL Editor
   # 1. supabase-setup.sql (database schema)
   # 2. supabase-storage-setup.sql (storage bucket)
   ```

2. Verify real-time is enabled:
   - Go to Database → Replication
   - Ensure `patients` table is enabled for real-time

3. Configure storage bucket:
   - Go to Storage
   - Verify `patient-images` bucket exists
   - Check bucket is public
   - Verify file size limits (5MB max)

### Security Considerations

1. **Row Level Security (RLS)**: Currently disabled for MVP. For production:
   - Enable RLS on patients table
   - Add policies for authenticated users only
   - Implement doctor authentication

2. **API Keys**: 
   - Use anon key for client-side (already configured)
   - Never expose service_role key in frontend

3. **CORS**: Supabase automatically handles CORS for your domain

## Build and Test Locally

Before deploying, test the production build locally:

```bash
# Build the production bundle
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### Build Verification Checklist

- [ ] Application loads without errors
- [ ] Patient triage form works end-to-end
- [ ] Doctor dashboard displays patients
- [ ] Real-time updates work
- [ ] Image upload functions correctly
- [ ] All routes work (/, /patient/triage, /doctor/dashboard)
- [ ] Mobile responsive design works
- [ ] No console errors in browser

## Post-Deployment Testing

After deployment, verify the following:

### Functional Testing

1. **Patient Flow**:
   - [ ] Submit a test patient through triage form
   - [ ] Verify data appears in Supabase
   - [ ] Check image upload works

2. **Doctor Dashboard**:
   - [ ] View patient list
   - [ ] Filter patients (All, Treated, Untreated)
   - [ ] Open patient detail modal
   - [ ] Mark patient as treated/untreated
   - [ ] Verify real-time updates

3. **Cross-Browser Testing**:
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Edge (latest)
   - [ ] Mobile Safari (iOS)
   - [ ] Mobile Chrome (Android)

### Performance Testing

1. Run Lighthouse audit:
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit for Performance, Accessibility, Best Practices, SEO
   - Target scores: 90+ for all categories

2. Check bundle size:
   ```bash
   npm run build
   # Review dist/ folder size
   # Should be < 500KB gzipped
   ```

## Monitoring and Maintenance

### Error Monitoring

Consider adding error tracking:
- Sentry
- LogRocket
- Rollbar

### Analytics (Optional)

Consider adding analytics:
- Google Analytics
- Plausible
- Fathom

### Continuous Deployment

Both Vercel and Netlify support automatic deployments:
- Push to `main` branch → automatic production deployment
- Push to other branches → preview deployments

## Rollback Procedure

### Vercel
1. Go to project deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Netlify
1. Go to "Deploys"
2. Find previous working deployment
3. Click "Publish deploy"

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build
- **Solution**: Run `npm run build` locally to identify errors
- Fix TypeScript issues before deploying

**Issue**: Missing environment variables
- **Solution**: Verify all required env vars are set in hosting platform

### Runtime Errors

**Issue**: "Failed to fetch" errors
- **Solution**: Check Supabase URL and anon key are correct
- Verify Supabase project is not paused

**Issue**: Images not loading
- **Solution**: Check storage bucket is public
- Verify CORS settings in Supabase

**Issue**: Real-time not working
- **Solution**: Verify real-time is enabled for patients table
- Check browser console for WebSocket errors

## Support

For issues:
1. Check browser console for errors
2. Check Supabase logs
3. Review hosting platform logs (Vercel/Netlify)
4. Verify environment variables are set correctly

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use environment variables** for all secrets
3. **Enable HTTPS** - Automatic with Vercel/Netlify
4. **Implement authentication** for doctor dashboard (future enhancement)
5. **Enable RLS** on Supabase tables (future enhancement)
6. **Regular security audits** - Run `npm audit` regularly
7. **Keep dependencies updated** - Review and update packages monthly

## Performance Optimization

The build is already optimized with:
- Code splitting (React, Supabase, UI components)
- Minification with Terser
- Tree shaking
- Lazy loading for routes
- Console.log removal in production

Additional optimizations:
- Consider adding CDN for static assets
- Enable compression (gzip/brotli) - automatic with Vercel/Netlify
- Monitor Core Web Vitals
- Optimize images (already using WebP support)

## Scaling Considerations

For high traffic:
1. **Database**: Supabase scales automatically
2. **Storage**: Supabase storage scales automatically
3. **Frontend**: Vercel/Netlify edge network handles scaling
4. **Real-time**: Monitor Supabase real-time connection limits

## Cost Estimation

### Supabase (Free Tier)
- 500MB database
- 1GB file storage
- 2GB bandwidth
- Upgrade to Pro ($25/month) for production

### Vercel (Hobby - Free)
- 100GB bandwidth
- Unlimited deployments
- Upgrade to Pro ($20/month) for team features

### Netlify (Starter - Free)
- 100GB bandwidth
- 300 build minutes
- Upgrade to Pro ($19/month) for team features

## Next Steps After Deployment

1. Set up custom domain
2. Configure SSL (automatic)
3. Add error monitoring
4. Set up analytics
5. Implement authentication for doctor dashboard
6. Enable Row Level Security in Supabase
7. Add automated testing in CI/CD pipeline
8. Set up staging environment
9. Document API endpoints
10. Create user documentation
