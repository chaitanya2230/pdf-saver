# Study PDF Organizer: Setup & Deployment Guide

This document outlines how to configure, run, and deploy the application.

## 🛠 Prerequisites
- Node.js & npm
- Python 3.9+
- PostgreSQL
- Firebase Account (for Cloud Storage)
- GitHub Account

---

## ☁️ Firebase Storage Setup (Cloud Storage)

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project** and name it "study-pdf-organizer".
3. Navigate to **Storage** and click **Get started**.
4. Choose **Start in test mode** (for development) and select a region closest to you.
5. In **Project Overview**, click the **Web `</>`** icon to add a web app.
6. Register the app, and copy the `firebaseConfig` object.
7. Open `frontend/src/firebase.js` (or your `.env` file) and replace the dummy values with your actual config.

**Important**: To allow PDF downloads and uploads from the web app, you must configure CORS rules of your Firebase Storage bucket using `gsutil`. Learn more about [configuring CORS on Firebase Storage](https://firebase.google.com/docs/storage/web/download-files#cors_configuration).

---

## 💾 PostgreSQL Database Setup (Local)

1. Install PostgreSQL on your machine.
2. Create a database using the psql CLI or pgAdmin:
   ```sql
   CREATE DATABASE pdf_organizer;
   CREATE USER pdf_user WITH PASSWORD 'password123';
   GRANT ALL PRIVILEGES ON DATABASE pdf_organizer TO pdf_user;
   ```
3. Copy the Database URL for the `.env` configuration (e.g., `postgres://pdf_user:password123@localhost:5432/pdf_organizer`).

---

## 🖥️ Local Setup

### 1. Django Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate. Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Create .env file inside backend/ and add:
# DATABASE_URL=postgres://pdf_user:password123@localhost:5432/pdf_organizer
# DJANGO_SECRET_KEY=your_secret_key
# DEBUG=True

python manage.py makemigrations api
python manage.py migrate
python manage.py createsuperuser  # Follow prompts to create an admin
python manage.py runserver
```
The Django API will be running on `http://localhost:8000/api/`. You can access the admin panel at `http://localhost:8000/admin/` to manage Subjects, Modules, and PDFs directly.

### 2. React Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
The React App will be running on `http://localhost:5173`. Make sure the `VITE_API_URL` environment variable (if set) points to `http://localhost:8000/api`.

---

## 🚀 Deployment

### Scenario A: Backend Deployment (Render)
Render handles Python apps and PostgreSQL databases seamlessly.

1. Create an account on [Render](https://render.com/).
2. Create a **New PostgreSQL** instance. Note down its Internal and External Database URL.
3. Push your repository to GitHub.
4. Create a **New Web Service** and connect your GitHub repo.
5. Set the **Root Directory** to `backend`.
6. **Environment**: Python 3
7. **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
8. **Start Command**: `gunicorn backend.wsgi:application`
9. **Environment Variables**:
   - `DATABASE_URL` = <Your Render PostgreSQL Internal URL>
   - `DJANGO_SECRET_KEY` = <A secure random key>
   - `DEBUG` = `False`
10. Click **Deploy Web Service**. Render will build and deploy your Django backend.

### Scenario B: Frontend Deployment (Vercel)
Vercel is optimal for modern React/Vite frontends.

1. Go to [Vercel](https://vercel.com/) and link your GitHub account.
2. Click **Add New** > **Project** and select your repository.
3. For the **Root Directory**, choose `frontend`.
4. The Build Settings should auto-detect "Vite" (Build Command: `npm run build`, Output Directory: `dist`).
5. Open **Environment Variables** and add:
   - `VITE_API_URL` = <Your Render Backend URL>/api
6. Click **Deploy**. Vercel will host your web app on a fast global CDN.

---

🎉 Your app is now production-ready and accessible publicly! Have a great exam preparation!
