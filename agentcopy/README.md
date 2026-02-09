# AgentCopy — AI Writing for NZ Real Estate

A web app that gives New Zealand real estate agents instant access to AI-powered writing tools for listings, vendor updates, social media, and more.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

Go to your Supabase project dashboard (https://supabase.com/dashboard):

1. Go to **Settings → API** and copy your **Project URL** and **anon/public key**
2. Go to **Authentication → Providers** and make sure **Email** is enabled
3. Go to **Authentication → URL Configuration** and set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Set up environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000 — you should see the login page. Sign up for an account, and you'll land on the workflow dashboard.

## Deploying to Vercel

1. Push this code to a GitHub repo
2. Go to https://vercel.com and import the repo
3. Add your environment variables in Vercel's project settings
4. Update your Supabase URL Configuration to include your Vercel domain:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

## Project Structure

```
agentcopy/
├── app/
│   ├── api/chat/route.js     # Claude API streaming endpoint
│   ├── auth/callback/route.js # Supabase auth callback
│   ├── dashboard/page.js      # Main app (workflow menu + chat)
│   ├── login/page.js          # Login page
│   ├── signup/page.js         # Signup page
│   ├── page.js                # Root redirect
│   ├── layout.js              # Root layout
│   └── globals.css            # Styles
├── lib/
│   ├── prompts.js             # System prompts per workflow (THE CORE IP)
│   ├── workflows.js           # Workflow menu definitions
│   ├── supabase-browser.js    # Supabase client (browser)
│   └── supabase-server.js     # Supabase client (server)
├── middleware.js               # Auth route protection
└── .env.local                  # Your API keys (not committed)
```

## Adding New Workflows

1. Add the workflow to `lib/workflows.js`
2. Add a matching system prompt in `lib/prompts.js`
3. That's it — it'll appear in the menu automatically

## Cost Estimates

- **Hosting (Vercel)**: Free tier
- **Supabase**: Free tier (50,000 monthly active users)
- **Anthropic API**: ~$0.01-0.05 per conversation using Claude Haiku
- **Domain**: ~$20/year

At 100 users doing 10 conversations/month each, API costs ≈ $10-50/month.
