# ShahShare - Secure File & Text Sharing App

**By Shahariar** 

A modern, elegant file and text sharing application built with Next.js and Supabase. Share files securely with password protection, automatic expiry, and custom short links.

## Features

✨ **Dual Upload Modes**
- Upload files (up to 10 files, 60MB total)
- Share text content directly

🔐 **Security**
- Optional password protection (bcryptjs hashing)
- Automatic content deletion after expiry
- Row-level security (RLS) on database

⏱️ **Flexible Expiry**
- Choose hours (1-240) or days (1-30)
- Auto-delete after expiration
- Visual countdown of time remaining

🔗 **Smart Sharing**
- Short, unique links (e.g., `shahshare.vercel.app/file/abc12345`)
- QR codes for easy mobile sharing
- Copy link functionality built-in

🎨 **Modern UI**
- Vercel-inspired dark theme (with light mode toggle)
- Responsive design (mobile-first)
- Beautiful gradient cards and smooth transitions

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage (1GB Permanent Free Tier)
- **Security**: bcryptjs, nanoid
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/shahariar-pro/ShahShare.git
   cd ShahShare
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set environment variables** (create `.env.local`)
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run locally**
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000

## Database & Storage Setup

### Supabase
1. Create a Supabase project at https://supabase.com
2. Run this SQL query in SQL Editor:

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

CREATE POLICY "Anyone can view uploads" ON public.uploads FOR SELECT USING (true);
CREATE POLICY "Users can create uploads" ON public.uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own" ON public.uploads FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users can delete their own" ON public.uploads FOR DELETE USING (user_id = auth.uid() OR user_id IS NULL);

CREATE INDEX idx_uploads_short_id ON public.uploads(short_id);
CREATE INDEX idx_uploads_expires_at ON public.uploads(expires_at);
CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
```

### Storage
1. Go to **Storage** in your Supabase dashboard.
2. Create a new bucket named **`files`**.
3. Set the bucket to **Public**.
4. Set policies to allow **Public Read** and **Insert/Delete** as needed.

## Deployment

### Deploy to Vercel

1. **Using Vercel CLI**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Or via GitHub**
   - Push to GitHub
   - Go to https://vercel.com
   - Click "New Project"
   - Select this repo
   - Add environment variables
   - Deploy!

3. **Set environment variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add the same variables from `.env.local`

Your app will be live at **shahshare.vercel.app** ✨

## File Structure

```
shahshare/
├── app/
│   ├── page.tsx              # Home/Upload page
│   ├── about/page.tsx        # About page with your info
│   ├── dashboard/page.tsx    # Dashboard/My Files
│   ├── file/[shortId]/       # Download page
│   └── api/
│       ├── upload/route.ts   # File upload API
│       ├── file/[shortId]/   # Download/access API
│       └── manage/route.ts   # File management
├── components/
│   ├── upload-zone.tsx       # Drag & drop upload
│   ├── text-upload.tsx       # Text content upload
│   ├── share-options.tsx     # Password/expiry options
│   ├── footer.tsx            # Footer with links
│   └── theme-toggle.tsx      # Dark/light mode
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── db.ts                 # Database functions
│   └── utils-file-sharing.ts # Utilities (hashing, QR codes)
└── public/
    └── favicon.jpg           # App favicon
```

## API Routes

### POST /api/upload
Upload file or text content
```json
{
  "file": File,
  "password": "optional",
  "expiryDays": 7,
  "description": "optional"
}
```

### GET /api/file/[shortId]
Download file (with optional password verification)

### GET /api/manage
List user's uploads

## Short Link Format

Links are generated using `nanoid(8)` for uniqueness:
- Example: `shahshare.vercel.app/file/aBc123xY`
- Extremely hard to guess
- Perfect for sharing

## Theme System

- **Dark Mode**: Deep black (oklch(0.08 0 0)) - Default
- **Light Mode**: Soft white (oklch(0.98 0 0))
- Toggle in top-right corner
- Preference saved in localStorage

## About Page

Shows:
- Creator: DEWAN SHAHARIAR HOSSEN
- Email: shahariar.professional@gmail.com
- GitHub: github.com/shahariar-pro
- LinkedIn: linkedin.com/in/dewan-shahariar

## Security Features

- ✅ Bcryptjs password hashing (10 salt rounds)
- ✅ Row-level security (RLS) on uploads
- ✅ Automatic expiry cleanup
- ✅ No authentication needed (privacy-first)
- ✅ HTTPS enforced on production

## Future Enhancements

- [ ] User accounts & history
- [ ] Bulk file downloads (ZIP)
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Admin panel

## License

Personal project - Feel free to fork and modify for your use!

## Support

Built with ❤️ by Shahariar  
Questions? Email: shahariar.professional@gmail.com

---

**For VS Code setup & deployment instructions, see VSCODE_SETUP.md**
