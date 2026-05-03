# ShahShare - Deployment Guide

This guide will walk you through downloading the code to VS Code, setting up the database and storage, pushing to GitHub, and deploying to Vercel.

## Step 1: Download to VS Code

1. **In v0**: Click the three dots in the top-right corner of the code block
2. **Select "Download ZIP"** to download the project
3. **Extract the ZIP** to your preferred location
4. **Open in VS Code**: 
   - Launch VS Code
   - File → Open Folder → Select the extracted folder
   - Or drag the folder into VS Code

## Step 2: Install Dependencies

In VS Code's integrated terminal, run:

```bash
pnpm install
```

This installs all required packages including Supabase, bcryptjs, nanoid, qrcode, and date-fns.

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy from your Supabase project
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get your Supabase credentials:**
1. Go to https://supabase.com
2. Open your project
3. Settings → API → Copy the URL and anon key
4. Paste them into `.env.local`

## Step 4: Test Locally

Run the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to test:
- Upload a file
- Set password and expiry
- View the share link

## Step 5: Connect to GitHub

1. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Name it "fileshare"
   - Don't initialize with README
   - Click Create

2. **Initialize Git in your project**:
   ```bash
   cd your-project-folder
   git init
   git add .
   git commit -m "Initial commit: ShahShare webapp"
   git remote add origin https://github.com/YOUR_USERNAME/fileshare.git
   git branch -M main
   git push -u origin main
   ```

3. **Verify on GitHub**:
   - Go to https://github.com/YOUR_USERNAME/fileshare
   - You should see all your code

## Step 6: Deploy to Vercel

1. **Sign up/Log in to Vercel**:
   - Go to https://vercel.com
   - Click "Continue with GitHub"
   - Authorize Vercel

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select "fileshare" repository
   - Click "Import"

3. **Configure Environment Variables**:
   - Under "Environment Variables", add:
     - `NEXT_PUBLIC_SUPABASE_URL` (from Step 3)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Step 3)
   - Click "Deploy"

4. **Vercel will automatically**:
   - Detect Next.js
   - Build the project
   - Deploy and provide a live URL (e.g., fileshare.vercel.app)

## Step 7: Enable Supabase Storage

1. Go to your Supabase project dashboard.
2. Click on **Storage** in the left sidebar.
3. Click **New Bucket** and name it `files`.
4. Make sure to set the bucket to **Public**.
5. Click **Save**.
6. Go to **Policies** and ensure you have policies that allow `SELECT` and `INSERT` for the `files` bucket (you can allow all for public usage).

## Step 8: Test Your Deployment

Once deployed:
1. Visit your Vercel URL (e.g., `https://fileshare.vercel.app`)
2. Upload a test file
3. Share the link
4. Open the shared link in incognito mode to test

## Database Structure

The Supabase `uploads` table should be created in the SQL Editor with:
- `id` - Unique upload ID
- `filename` - Original filename
- `file_size` - File size in bytes
- `blob_url` - Supabase Storage Public URL
- `short_id` - Custom short link ID
- `password_hash` - Hashed password (if set)
- `expires_at` - Expiration timestamp
- `description` - Optional message
- `downloaded_count` - Download counter
- `created_at` - Creation timestamp

## New Features Added

### Theme Switcher
- Click the sun/moon icon in the header to toggle between dark and light modes
- Your preference is saved in browser localStorage
- Light theme uses complementary colors for great contrast

### About Page
- Navigate to `/about` to see information about Shahariar
- Includes contact links to email, GitHub, and LinkedIn
- Beautiful card-based layout

### Footer
- Present on every page with branding "by Shahariar"
- Quick navigation links to Upload, Dashboard, and About
- Social media links for easy connecting

### Branding
- "ShahShare by Shahariar" appears throughout the app
- Professional, elegant dark theme by default (with light mode option)

## Future Updates

To push updates to production:

```bash
# Make changes locally
# Test with `pnpm dev`

# Commit and push
git add .
git commit -m "Your update message"
git push

# Vercel will automatically redeploy!
```

## Custom Domain Setup

Once you have a domain (e.g., fileshare.shahariar.com):

1. **In Vercel Dashboard**:
   - Go to your project
   - Settings → Domains
   - Add your custom domain
   - Follow DNS instructions

2. **Update environment variables** if needed for custom domain references

## Troubleshooting

### Files not uploading?
- Check `.env.local` has correct Supabase credentials
- Ensure Vercel Blob is enabled in Vercel project settings

### Password verification failing?
- Clear browser cache
- Check network tab for API errors

### Expired files still showing?
- They're still in database until explicitly deleted
- Set a cleanup cron job if needed (advanced)

## Next Steps for Enhancement

Potential improvements:
- User authentication (optional)
- Dashboard to view all uploads
- Email notifications on share
- Analytics/usage tracking
- Custom domain support
- Bulk file upload optimization

Good luck with ShahShare!
