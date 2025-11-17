# Supabase Backend Setup Guide

This guide will walk you through setting up the Supabase backend for NightShift MD.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: nightshift-md (or your preferred name)
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Select the region closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

## Step 4: Create the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-setup.sql` from your project root
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL
6. You should see a success message confirming the table and indexes were created

### What this creates:
- `patients` table with all required columns and constraints
- Indexes for optimized querying and sorting
- Real-time subscription enabled for the patients table

## Step 5: Create the Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Configure the bucket:
   - **Name**: `patient-images`
   - **Public bucket**: Toggle ON (images need to be publicly accessible)
   - Click "Create bucket"

4. Configure bucket policies:
   - Click on the `patient-images` bucket
   - Go to **Policies** tab
   - Click "New Policy"
   - Select "For full customization" and add this policy:

   ```sql
   -- Allow anonymous uploads
   CREATE POLICY "Allow anonymous uploads"
   ON storage.objects FOR INSERT
   TO anon
   WITH CHECK (bucket_id = 'patient-images');

   -- Allow public reads
   CREATE POLICY "Allow public reads"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'patient-images');
   ```

5. Set file size and type restrictions:
   - Go to **Settings** > **Storage**
   - Set **Maximum file size**: 5 MB
   - Allowed MIME types are enforced in the application code

## Step 6: Verify Real-time is Enabled

1. Go to **Database** > **Replication**
2. Ensure the `patients` table is listed under "Source"
3. If not, click "Add table" and select `patients`

## Step 7: Test the Connection

1. Install dependencies if you haven't already:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The application should start without errors. Check the console for any Supabase connection issues.

## Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables configured in `.env`
- [ ] `patients` table created with all constraints
- [ ] Indexes created on `risk_level`, `created_at`, and `treated`
- [ ] Real-time enabled for `patients` table
- [ ] `patient-images` storage bucket created
- [ ] Storage bucket is public
- [ ] Storage policies configured for uploads and reads
- [ ] Application starts without Supabase connection errors

## Troubleshooting

### "Missing Supabase environment variables" error
- Ensure your `.env` file exists in the project root
- Verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/modifying `.env`

### "relation 'patients' does not exist" error
- Make sure you ran the SQL schema in Step 4
- Check the SQL Editor for any error messages
- Verify you're connected to the correct project

### Real-time updates not working
- Verify real-time is enabled in Database > Replication
- Check that the `patients` table is listed under replication sources
- Ensure you ran the `ALTER PUBLICATION` command in the SQL schema

### Image upload fails
- Verify the `patient-images` bucket exists and is public
- Check that storage policies are configured correctly
- Ensure file size is under 5MB and format is JPEG, PNG, or WebP

## Security Notes

### Current Setup (Development)
The current setup allows anonymous access to the database and storage for development purposes. This is acceptable for a prototype but **NOT recommended for production**.

### For Production
Before deploying to production, you should:

1. **Enable Row Level Security (RLS)**:
   - Uncomment the RLS policies in `supabase-setup.sql`
   - Run them in the SQL Editor

2. **Implement Authentication**:
   - Add authentication for the doctor dashboard
   - Restrict patient data access to authenticated doctors only

3. **Secure Storage**:
   - Implement signed URLs for image access
   - Add authentication checks to storage policies

4. **Environment Variables**:
   - Use separate Supabase projects for development and production
   - Never expose your service_role key in client-side code

## Next Steps

Once your Supabase backend is set up, you can proceed with implementing the remaining tasks:
- Task 3: Core UI component library
- Task 4: Risk calculation and validation utilities
- Task 5: Patient service and image handling

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Storage Guide](https://supabase.com/docs/guides/storag