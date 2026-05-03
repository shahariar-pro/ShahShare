# ShahShare - FINAL INSTRUCTIONS FOR YOU

**Everything is ready! Here's exactly what to do next:**

---

## STEP 1: Download ZIP from v0

1. Click the **three dots (...)** button in top-right of v0
2. Select **"Download ZIP"**
3. Extract the ZIP to your computer
4. Open the folder in VS Code: `File → Open Folder`

---

## STEP 2: Install & Test Locally (3 minutes)

Open Terminal in VS Code (Ctrl+` or Terminal menu):

```bash
# Install dependencies
pnpm install

# Create .env.local file with your credentials
# See VSCODE_SETUP.md for exact values

# Test locally
pnpm dev
```

Visit http://localhost:3000 and test everything!

---

## STEP 3: Push to GitHub (2 minutes)

```bash
# Navigate to your project folder
cd /path/to/ShahShare

# Initialize git
git init
git config user.email "shahariar.professional@gmail.com"
git config user.name "Dewan Shahariar Hossen"

# Add your existing repo
git remote add origin https://github.com/shahariar-pro/ShahShare.git

# Push everything
git add .
git commit -m "Initial ShahShare deployment"
git branch -M main
git push -u origin main
```

---

## STEP 4: Deploy to Vercel (1 minute)

**Option A: Using Vercel CLI (Easiest)**
```bash
npm install -g vercel
vercel
```
Follow prompts, add environment variables when asked.

**Option B: Manual via Dashboard**
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo `shahariar-pro/ShahShare`
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

**Your app is now live at: https://shahshare.vercel.app** ✨

---

## STEP 5: Environment Variables

**Create `.env.local` file in your project root:**

```
# Get these from Supabase (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**For Production (Vercel Dashboard):**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add the same variables above
4. Deploy will use these automatically

---

## STEP 6: Database & Storage Setup (One-Time)

### 1. Create Database Table
Go to your Supabase project → SQL Editor and run:

```sql
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT,
  blob_url TEXT NOT NULL,
  short_id TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  downloaded_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view" ON public.uploads FOR SELECT USING (true);
CREATE POLICY "Users can create" ON public.uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own" ON public.uploads FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users can delete own" ON public.uploads FOR DELETE USING (user_id = auth.uid() OR user_id IS NULL);

CREATE INDEX idx_uploads_short_id ON public.uploads(short_id);
CREATE INDEX idx_uploads_expires_at ON public.uploads(expires_at);
CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
```

### 2. Create Storage Bucket
1. Go to **Storage** in Supabase.
2. Click **New Bucket**, name it `files`.
3. Set to **Public**.
4. Add policies to allow anyone to upload and read.

---

## What's Included in ShahShare

✅ **Home Page**
- File upload (drag & drop)
- Text upload mode
- Password protection option
- Hours or Days expiry selection
- Beautiful "by Shahariar" branding

✅ **Dashboard**
- View your uploads
- Download files
- Delete files
- See expiry status

✅ **Download Page**
- Share link with password verification
- Download functionality
- QR code display
- Time remaining countdown

✅ **About Page**
- Your profile: DEWAN SHAHARIAR HOSSEN
- Email: shahariar.professional@gmail.com
- GitHub: github.com/shahariar-pro
- LinkedIn: linkedin.com/in/dewan-shahariar

✅ **Features**
- Dark/Light theme toggle
- Responsive design (mobile-friendly)
- Short links: `shahshare.vercel.app/file/abc12345`
- Auto-delete after expiry
- Password hashing with bcryptjs
- QR codes for sharing

---

## Making Changes Later

After deployment, to make updates:

```bash
# Make your changes in VS Code
# Test locally: pnpm dev

# Push to GitHub
git add .
git commit -m "Your change description"
git push

# Vercel auto-deploys! (Or manually click "Redeploy" in dashboard)
```

---

## Troubleshooting

**"pnpm: command not found"**
```bash
npm install -g pnpm
```

**Environment variables not working**
- Restart dev server: `pnpm dev`
- For Vercel: add them in Settings → Environment Variables
- Redeploy after adding

**Database errors**
- Check Supabase table exists (run SQL above)
- Verify URL and key are correct
- Check RLS policies are enabled

**Git push rejected**
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

---

## File Structure

```
ShahShare/
├── app/
│   ├── page.tsx              # Home
│   ├── about/page.tsx        # About You
│   ├── dashboard/page.tsx    # My Files
│   ├── file/[shortId]/page.tsx # Download
│   ├── api/upload/route.ts   # Upload API
│   └── layout.tsx            # Layout + Theme
├── components/
│   ├── upload-zone.tsx       # File upload
│   ├── text-upload.tsx       # Text content
│   ├── share-options.tsx     # Password/expiry
│   ├── footer.tsx            # Footer links
│   └── theme-toggle.tsx      # Dark/Light mode
├── lib/
│   ├── supabase/             # Database clients
│   ├── db.ts                 # DB functions
│   └── utils-file-sharing.ts # Utilities
├── public/
│   └── favicon.jpg           # App icon
├── VSCODE_SETUP.md           # Detailed VS Code guide
├── SHAHSHARE_README.md       # Full documentation
└── .env.local                # Your secrets (don't share!)
```

---

## Quick Commands Reference

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Check code quality

# Git & GitHub
git add .         # Stage changes
git commit -m ""  # Commit changes
git push          # Push to GitHub
git pull          # Pull latest changes

# Deployment
vercel            # Deploy to Vercel
vercel --prod     # Deploy to production
```

---

## Key Information

- **GitHub Repo**: https://github.com/shahariar-pro/ShahShare
- **Live Site**: https://shahshare.vercel.app (after deployment)
- **Supabase Project**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Email**: shahariar.professional@gmail.com

---

## What If Something Goes Wrong?

1. **Check logs**: 
   - Local: Terminal output from `pnpm dev`
   - Production: Vercel Dashboard → Deployments → Logs

2. **Check environment variables**:
   - Local: `.env.local` file exists?
   - Production: Vercel Settings → Environment Variables

3. **Check database**:
   - Supabase SQL Editor → Run table creation query
   - Check RLS policies are enabled

4. **Re-deploy**:
   - Push to GitHub: `git push`
   - Vercel auto-redeploys
   - Or click "Redeploy" in Vercel dashboard

---

## You're All Set!

Everything is configured and ready. You have:

✅ Complete ShahShare app
✅ Favicon (Upload icon)
✅ "by Shahariar" branding everywhere
✅ Hours & Days expiry options
✅ File & Text upload modes
✅ Dark/Light theme toggle
✅ About page with your info
✅ Supabase database ready
✅ Vercel deployment ready
✅ GitHub repo ready

**Next steps: Download ZIP → Extract → `pnpm install` → `pnpm dev` → Push to GitHub → Deploy to Vercel**

That's it! You've got ShahShare live on the internet! 🚀

---

For detailed setup instructions, see **VSCODE_SETUP.md**  
For full documentation, see **SHAHSHARE_README.md**
