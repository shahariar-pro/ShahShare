# ShahShare - VS Code Setup & Deployment Guide

## Part 1: Download & Setup in VS Code

### Step 1: Download the ZIP from v0
1. Click the **three dots (...)** in top right of v0
2. Select **Download ZIP**
3. Extract the ZIP file to your computer
4. Open the folder in VS Code: `File → Open Folder`

### Step 2: Install Dependencies
Open VS Code terminal (Ctrl+` or Terminal menu) and run:

```bash
pnpm install
```

If you don't have pnpm installed globally, install it first:
```bash
npm install -g pnpm
```

### Step 3: Set Up Environment Variables
Create a file named `.env.local` in the root folder (next to package.json):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these:**
- **Supabase URL & Key**: Go to your Supabase project → Settings → API → Copy the URL and anon key

### Step 4: Test Locally
Run the dev server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser to test. Everything should work!

---

## Part 2: Push to Existing GitHub Repo

### Step 1: Initialize Git (if not already done)
```bash
cd /path/to/shahshare-folder
git init
git config user.email "shahariar.professional@gmail.com"
git config user.name "Dewan Shahariar Hossen"
```

### Step 2: Add Remote (Your Existing Repo)
```bash
git remote add origin https://github.com/shahariar-pro/ShahShare.git
git branch -M main
```

### Step 3: Stage, Commit & Push
```bash
git add .
git commit -m "Initial ShahShare deployment from v0"
git push -u origin main
```

**If push is rejected**, your GitHub repo might already have content. In that case:
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

---

## Part 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts:
   - Link to your Vercel account (login if needed)
   - Select "Existing project" or create new
   - Confirm project name
   - **Confirm these settings**:
     - Framework: **Next.js**
     - Root directory: **./**.

4. Set environment variables in Vercel:
   - After deployment, go to your Vercel dashboard
   - Project → Settings → Environment Variables
   - Add the same `.env.local` variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

5. Done! Your app is live at **shahshare.vercel.app**

### Option B: Deploy via Vercel Dashboard (No CLI)
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo: **shahariar-pro/ShahShare**
4. Click "Import"
5. Add environment variables (same as above)
6. Click "Deploy"

---

## Part 4: Custom Domain Setup

### To use shahshare.vercel.app (Already Works!)
Your app automatically deploys to this subdomain on Vercel. No extra setup needed!

### To use a custom domain (Optional)
1. Buy a domain (e.g., from Godaddy, Namecheap, etc.)
2. Go to Vercel dashboard → Your Project → Settings → Domains
3. Click "Add Domain"
4. Enter your domain and follow DNS setup instructions
5. Wait 24-48 hours for DNS to propagate

---

## Part 5: Database & Storage Setup (IMPORTANT!)

### Supabase Setup (Required for Data & Storage)
1. Go to https://supabase.com
2. Create a new project (free tier is fine)
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 1: Create Database Table
Go to SQL Editor → Create the uploads table:

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

CREATE POLICY "Anyone can view uploads" ON public.uploads
  FOR SELECT USING (true);

CREATE POLICY "Users can create uploads" ON public.uploads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own" ON public.uploads
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete their own" ON public.uploads
  FOR DELETE USING (user_id = auth.uid() OR user_id IS NULL);

CREATE INDEX idx_uploads_short_id ON public.uploads(short_id);
CREATE INDEX idx_uploads_expires_at ON public.uploads(expires_at);
CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
```

### Step 2: Create Storage Bucket
1. Go to **Storage** in the Supabase sidebar.
2. Click **"New Bucket"**.
3. Name it **"files"**.
4. Set it to **Public** (so links can be shared).
5. Click **Create**.
6. Go to **Policies** (under Storage) and add:
   - **Select policy**: Allow public access to read.
   - **Insert policy**: Allow anyone to upload (or authenticated only if you add auth later).
   - **Delete policy**: Allow users to delete their own files.
   *(Or simply "Enable all" for public testing if preferred)*.

---

## Part 6: Make Changes & Redeploy

### After Making Changes Locally:
```bash
# Test locally
pnpm dev

# Push to GitHub
git add .
git commit -m "Your change description"
git push

# Vercel auto-deploys! (Or manually click "Redeploy" in Vercel dashboard)
```

---

## Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### Environment variables not working
- Make sure `.env.local` file exists in root folder
- Restart dev server: `pnpm dev`
- For production: add them to Vercel Settings → Environment Variables

### Database errors
- Check that Supabase table exists (see Part 5)
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key are correct
- Make sure RLS policies are enabled

### "git push rejected"
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

---

## Quick Reference

**Start dev server:**
```bash
pnpm dev
```

**Test build:**
```bash
pnpm build
```

**Deploy to Vercel:**
```bash
vercel
```

**Push to GitHub:**
```bash
git add . && git commit -m "message" && git push
```

---

## Support
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

Good luck with ShahShare! 🚀
