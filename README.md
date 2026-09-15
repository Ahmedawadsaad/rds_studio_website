# Red Door Studio Website

A full-stack studio portfolio website with a public-facing read-only experience and an admin dashboard for managing projects and categories.

## Project Structure

### Frontend
The frontend is a Next.js app that renders the public website and admin panel.

- `src/App.tsx` — router setup
- `src/pages/PublicSite.tsx` — public portfolio landing page
- `src/pages/ProjectDetail.tsx` — project detail page
- `src/pages/Admin.tsx` — admin dashboard and login flow
- `src/components/` — reusable UI sections and animations
- `src/data.ts` — initial fallback project and studio content
- `src/lib/api.ts` — API client used by the frontend

### Backend
The backend is implemented as Next.js API routes with Supabase for auth and content management.

- `server/index.js` — API entry point
- `lib/supabaseAdmin.ts` — server-only Supabase client
- `pages/api/[...path].ts` — API routes
- `supabase/schema.sql` — database tables and policies

### Root config
- `package.json` — frontend + backend scripts
- `next.config.ts` — Next.js configuration and API rewrite
- `.env` — local environment settings
- `.env.example` — sample environment variables

---

## Tech Stack

- React 19
- Next.js 15
- TypeScript
- Tailwind CSS v4
- Express.js
- Supabase Postgres + Supabase Auth
- Cloudinary image storage

---

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a local environment file from the sample:
   ```bash
   copy .env.example .env
   ```

3. Update `.env` with your Supabase and Cloudinary values:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   CLIENT_URL=http://localhost:5173
   NEXT_PUBLIC_API_URL=/api
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

5. Open the app in the browser:
   ```text
   http://localhost:5173
   ```

6. Open the admin page:
   ```text
   http://localhost:5173/admin
   ```

---

## Admin Login

Create the admin account in Supabase Authentication, then add its user ID to `admin_profiles`:

```sql
insert into public.admin_profiles (id, name, role, company_name)
values ('SUPABASE_AUTH_USER_ID', 'RDS Admin', 'super-admin', 'Red Door Studio');
```

---

## Public vs Admin Behavior

### Public Site
- Read-only experience
- Visitors can browse the projects and portfolio
- No write access

### Admin Area
- Requires login
- Can create new projects
- Can delete projects
- Can create categories
- Stores data in Supabase

---

## API Endpoints

### Public
- `GET /api/health`
- `GET /api/projects`
- `GET /api/categories`

### Admin
- `POST /api/admin/login`
- `GET /api/admin/me`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
- `POST /api/admin/categories`

## Production Deployment

Deploy the frontend and API together behind one domain when possible. Configure the API service with:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

The frontend and API are now deployed together on Vercel. No Render service or API URL variable is needed.

Image uploads use the public `project-images` Supabase Storage bucket, and only public image URLs are stored in Supabase tables.

---

## Deploying to Production

### Recommended setup
- Frontend and API: Vercel
- Database and Auth: Supabase

### Required environment variables in production
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Content Editing

Project content, studio info, categories, and demo images are primarily managed in:

- `src/data.ts`

For production usage, the admin panel should be used to keep content managed from Supabase instead of static fallback data.

---

## Notes

- The frontend has a fallback to local static data when the backend is not reachable.
- Run `supabase/schema.sql` in Supabase SQL Editor before deploying.
- This setup is intended for a portfolio site where the public site stays read-only and only admin users can edit the content.
