# Google Authentication Setup Guide

This guide will help you set up Google OAuth and Drive API for the BYD CRM application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **New Project**
3. Name it "BYD CRM" (or any name you prefer)
4. Click **Create**

## Step 2: Enable Required APIs

1. In your project, go to **APIs & Services** → **Library**
2. Search for and enable these APIs:
   - **Google Drive API** (for file storage)
   - **Google Identity Services** (already enabled by default)

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (or Internal if using Google Workspace)
3. Fill in the required fields:
   - **App name**: BYD CRM
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On the Scopes page, click **Add or Remove Scopes**
6. Add these scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/drive.file` (for Drive access)
7. Click **Update** → **Save and Continue**
8. Add test users (your email and any other users who will test the app)
9. Click **Save and Continue**

## Step 4: Create OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Name it "BYD CRM Web Client"
5. Add **Authorized JavaScript origins**:
   - `http://localhost:5173` (for local development)
   - `https://zeromizer.github.io` (for GitHub Pages)
6. Add **Authorized redirect URIs**:
   - `http://localhost:5173` (for local development)
   - `https://zeromizer.github.io/BYD-CRM-2` (for GitHub Pages)
7. Click **Create**
8. **Copy the Client ID** (you'll need this!)

## Step 5: Create API Key

1. In **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **API key**
3. **Copy the API key** (you'll need this!)
4. Click **Edit API key** to restrict it:
   - Under **Application restrictions**, select **HTTP referrers**
   - Add these referrers:
     - `http://localhost:5173/*`
     - `https://zeromizer.github.io/BYD-CRM-2/*`
   - Under **API restrictions**, select **Restrict key**
   - Select: **Google Drive API**
5. Click **Save**

## Step 6: Configure Environment Variables

### For Local Development:

1. Create a `.env` file in the project root (same folder as `package.json`)
2. Add your credentials:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-api-key-here
VITE_ENCRYPTION_SALT=generate-a-random-32-character-string-here
```

**Important**: Never commit the `.env` file to git! It's already in `.gitignore`.

### For GitHub Pages:

For GitHub Pages deployment, you'll need to:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add these repository secrets:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_API_KEY`
   - `VITE_ENCRYPTION_SALT`

**Note**: For now, you can test locally. GitHub Actions deployment will be set up later.

## Step 7: Generate Encryption Salt

Generate a random 32+ character string for the encryption salt:

```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use an online generator:
# https://www.random.org/strings/
```

## Step 8: Test the Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your actual credentials to `.env`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173
5. Click "Sign in with Google"
6. You should see a Google sign-in popup!

## Troubleshooting

### "Access blocked" error
- Make sure you added yourself as a test user in the OAuth consent screen
- Wait a few minutes after making changes

### "Invalid client" error
- Double-check your Client ID in the `.env` file
- Make sure there are no extra spaces

### "Redirect URI mismatch" error
- Verify the redirect URIs in Google Cloud Console match your app's URL exactly
- For local dev: `http://localhost:5173`
- For GitHub Pages: `https://zeromizer.github.io/BYD-CRM-2`

### Still getting configuration errors?
- Restart the dev server after creating/modifying `.env`
- Clear your browser cache
- Check the browser console for specific error messages

## Security Notes

- **Never commit** your `.env` file
- **Never share** your API key or Client ID publicly
- The Client ID is "public" but should still be kept secure
- The API key should be restricted to your domain/referrers
- Encryption salt should be truly random and never changed (or you'll lose access to encrypted data)

## Next Steps

Once authentication is working:
1. ✅ Users can sign in with Google
2. ✅ Each consultant's data is isolated
3. 🔜 Set up Google Drive integration (Phase 2)
4. 🔜 Deploy with environment variables to GitHub Pages

---

**Need help?** Check the [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2) or the [Drive API Quickstart](https://developers.google.com/drive/api/quickstart/js)
