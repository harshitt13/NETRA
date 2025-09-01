# 🚀 Project NETRA - Cloud Deployment Guide

This guide will help you deploy Project NETRA to production using modern cloud platforms.

## 📋 Deployment Architecture

- **Frontend**: Vercel (React app)
- **Backend**: Railway or Render (Flask API)
- **Database**: Neo4j Aura (managed Neo4j)
- **Authentication & Storage**: Firebase (already configured)
- **AI**: Google Gemini API

## 🔧 Prerequisites

1. **Accounts needed**:
   - [Vercel](https://vercel.com) account
   - [Railway](https://railway.app) or [Render](https://render.com) account
   - [Neo4j Aura](https://neo4j.com/cloud/aura/) account
   - [Google Cloud](https://cloud.google.com) account (for Gemini API)
   - [Firebase](https://firebase.google.com) project

2. **Repository**: Push your code to GitHub

## 🗄️ Database Setup (Neo4j Aura)

### Step 1: Create Neo4j Aura Instance
1. Go to [Neo4j Aura](https://console.neo4j.io/)
2. Create a new **AuraDB Free** instance
3. Choose a name like "netra-production"
4. Save the connection details (URI, username, password)
5. Download the connection credentials

### Step 2: Load Data to Neo4j Aura
```bash
# Update backend/data-generation/load_to_neo4j.py with Aura credentials
# Then run the data loader
cd backend/data-generation
python load_to_neo4j.py
```

## 🔧 Backend Deployment (Railway)

### Step 1: Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your NETRA repository
4. Choose the `backend` folder as the root directory

### Step 2: Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```bash
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5001

# Neo4j Configuration (from Aura instance)
NEO4J_URI=neo4j+s://xxxxxxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_aura_password

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# CORS (update after frontend deployment)
FRONTEND_URL=https://your-app.vercel.app
```

### Step 3: Deploy
Railway will automatically deploy your backend. You'll get a URL like:
`https://your-app-name.up.railway.app`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. **Framework Preset**: Vite
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`

### Step 2: Configure Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:

```bash
# API Configuration
VITE_API_URL=https://your-backend.up.railway.app/api

# Authentication (optional)
VITE_USE_MOCK_AUTH=false
```

### Step 3: Deploy
Vercel will automatically build and deploy. You'll get a URL like:
`https://your-app.vercel.app`

### Step 4: Update Backend CORS
Go back to Railway and update the `FRONTEND_URL` variable with your Vercel URL.

## 🔑 API Keys Setup

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your Railway environment variables

### Firebase Configuration
1. Go to Firebase Console
2. Project Settings → General → Your apps
3. Add a web app if not already done
4. Copy the config and update `frontend/src/firebase/firebaseConfig.js`
5. Enable Authentication and Firestore in Firebase Console

## 🚀 Alternative Backend Deployment (Render)

If you prefer Render over Railway:

### Step 1: Create Web Service
1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: netra-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Root Directory**: `backend`

### Step 2: Environment Variables
Add the same environment variables as listed in the Railway section.

## 📊 Data Generation for Production

### Option 1: Run Data Generation Locally
```bash
cd data-generation
python generate_data.py

cd ../backend/data-generation
python load_to_neo4j.py
```

### Option 2: API Endpoint (if configured)
Use the `/api/settings/regenerate-data` endpoint from your deployed frontend.

## 🔍 Post-Deployment Testing

### 1. Test Backend Health
Visit: `https://your-backend.up.railway.app/api/health`
Should return: `{"status": "healthy", "message": "Project Netra backend is running."}`

### 2. Test Frontend
Visit: `https://your-app.vercel.app`
- Login should work
- Dashboard should load (may be empty initially)
- Run analysis to generate alerts

### 3. Test Full Workflow
1. Login to the application
2. Run analysis from the dashboard
3. View generated alerts
4. Open investigation workspace
5. Generate PDF reports

## ⚡ Performance Optimization

### Frontend (Vercel)
- Automatic CDN and caching
- Gzip compression enabled
- Static asset optimization

### Backend (Railway)
- Consider upgrading to a paid plan for better performance
- Enable keep-alive connections
- Add Redis caching if needed

### Database (Neo4j)
- Use connection pooling
- Optimize Cypher queries
- Consider upgrading Aura instance for larger datasets

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your Vercel domain
   - Check allowed origins in app.py

2. **Database Connection**
   - Verify Neo4j Aura credentials
   - Check if Aura instance is running
   - Ensure proper URI format (neo4j+s://)

3. **API Errors**
   - Check Railway logs for backend errors
   - Verify all environment variables are set
   - Test individual endpoints

4. **Build Failures**
   - Check package.json scripts
   - Verify all dependencies are listed
   - Check Node.js version compatibility

## 📱 Mobile Responsiveness

The frontend is built with Tailwind CSS and should be mobile-responsive. Test on:
- Mobile devices
- Tablets
- Different screen sizes

## 🔒 Security Considerations

### Production Security:
1. Use strong passwords for all services
2. Enable 2FA on all accounts
3. Rotate API keys regularly
4. Monitor access logs
5. Use HTTPS everywhere (automatically handled by Vercel/Railway)

### Environment Variables:
- Never commit `.env` files
- Use platform-specific secret management
- Rotate sensitive keys regularly

## 📈 Monitoring & Analytics

### Recommended additions:
1. **Sentry** for error tracking
2. **Google Analytics** for usage insights
3. **Uptime monitoring** (UptimeRobot, etc.)
4. **Performance monitoring** (Vercel Analytics)

## 🎯 Production Checklist

- [ ] Neo4j Aura instance created and configured
- [ ] Backend deployed to Railway/Render
- [ ] Frontend deployed to Vercel
- [ ] All environment variables configured
- [ ] CORS properly configured
- [ ] Database populated with data
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] PDF generation functional
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Monitoring setup
- [ ] Security review completed

## 🚀 Going Live

1. **Custom Domain** (optional):
   - Add custom domain to Vercel
   - Update CORS configuration
   - Configure DNS

2. **SSL Certificates**:
   - Automatically handled by Vercel and Railway

3. **Final Testing**:
   - Test all features end-to-end
   - Performance testing
   - Security testing

Your Project NETRA is now ready for production! 🎉

## 📞 Support

For deployment issues:
- Check the platform-specific documentation
- Review logs in dashboard
- Test individual components
- Verify environment variables

Happy deploying! 🚀
