# Vercel Deployment Configuration

## Environment Variables

Add these in your Vercel project settings:

### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_demo_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_demo_anon_key
```

### Demo Mode (Optional)
```
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_EMAIL=demo@example.com
NEXT_PUBLIC_DEMO_PASSWORD=DemoPassword123
```

## Deployment Steps

### Option 1: Vercel Dashboard

1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Add environment variables (see above)
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_DEMO_MODE

# Deploy to production
vercel --prod
```

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Performance Optimizations

The project is already configured for optimal Vercel deployment:
- ✅ Static page optimization
- ✅ Image optimization with next/image
- ✅ Automatic code splitting
- ✅ Edge functions for API routes
- ✅ PWA support

## Monitoring

After deployment, you can monitor:
- Real-time logs in Vercel dashboard
- Performance metrics
- Error tracking
- Analytics

## Automatic Deployments

Vercel will automatically deploy when you:
- Push to the `main` branch (production)
- Push to other branches (preview deployments)
- Create pull requests (preview deployments)

## Security Checklist

- [ ] Environment variables configured
- [ ] Using separate Supabase instance for demo
- [ ] Row Level Security enabled in Supabase
- [ ] Demo mode flag set
- [ ] Rate limiting considered (optional)

## Post-Deployment

1. Test all features in production
2. Verify environment variables are working
3. Check database connection
4. Test authentication flow
5. Update README with live demo link

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Run `npm run build` locally first

### Environment Variables Not Working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side
- Redeploy after adding/changing variables

### Database Connection Issues
- Verify Supabase URL and key
- Check RLS policies
- Ensure tables exist

## Support

For deployment issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

🚀 Your demo is ready to go live!
