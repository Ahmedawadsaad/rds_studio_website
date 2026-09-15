# Red Door Studio Website

A full-stack studio portfolio website with a public-facing read-only experience and an admin dashboard for managing projects and categories.

## Project Structure

### Frontend
The frontend is a React + Vite app that renders the public website and admin panel.

- `src/App.tsx` — router setup
- `src/pages/PublicSite.tsx` — public portfolio landing page
- `src/pages/ProjectDetail.tsx` — project detail page
- `src/pages/Admin.tsx` — admin dashboard and login flow
- `src/components/` — reusable UI sections and animations
- `src/data.ts` — initial fallback project and studio content
- `src/lib/api.ts` — API client used by the frontend

### Backend
The backend is an Express + MongoDB API for auth and content management.

- `server/index.js` — API entry point
- `server/db.js` — MongoDB connection bootstrapping
- `server/models/AdminUser.js` — admin user model
- `server/models/Project.js` — project model
- `server/models/Category.js` — category model

### Root config
- `package.json` — frontend + backend scripts
- `vite.config.ts` — Vite config
- `index.html` — Vite HTML shell
- `.env` — local environment settings
- `.env.example` — sample environment variables

---

## Tech Stack

- React 19
- Vite 8
- TypeScript
- Tailwind CSS v4
- Express.js
- MongoDB + Mongoose
- JWT-based admin auth

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

3. Update `.env` with your local MongoDB URI and secret values:
   ```env
   PORT=5000
   JWT_SECRET=your-dev-secret
   MONGODB_URI=mongodb://127.0.0.1:27017/rds-studio
   CLIENT_URL=http://localhost:5173
   VITE_API_URL=/api
   ```

4. Start the backend:
   ```bash
   npm run server
   ```

5. Start the frontend:
   ```bash
   npm run dev
   ```

6. Open the app in the browser:
   ```text
   http://localhost:5173
   ```

7. Open the admin page:
   ```text
   http://localhost:5173/admin
   ```

---

## Admin Login

Default seeded admin account:

- Email: `admin@rds.com`
- Password: `rds2024`

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
- Stores data in MongoDB

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
JWT_SECRET=<long-random-secret>
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/rds-studio
CLIENT_URL=https://your-domain.com
```

If the frontend and API use different domains, set `VITE_API_URL=https://api.your-domain.com/api` before running `npm run build`, and set `CLIENT_URL` to the frontend domain. The backend start command is `npm start`.

The current admin image upload stores images as Data URLs in MongoDB. Keep uploads small for now; for production galleries, move image storage to Cloudinary, S3, or another object-storage service and save only image URLs in MongoDB.

---

## Deploying to Production

### Recommended setup
- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: MongoDB Atlas

### Required environment variables in production
```env
PORT=5000
JWT_SECRET=change_this_to_a_secure_value
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/rds-studio
CLIENT_URL=https://your-domain.com
```

---

## Content Editing

Project content, studio info, categories, and demo images are primarily managed in:

- `src/data.ts`

For production usage, the admin panel should be used to keep content managed from MongoDB instead of static fallback data.

---

## Notes

- The frontend has a fallback to local static data when the backend is not reachable.
- The backend creates the default admin account automatically on first successful MongoDB connection.
- This setup is intended for a portfolio site where the public site stays read-only and only admin users can edit the content.
