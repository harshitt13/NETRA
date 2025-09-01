# 🚀 Project NETRA - Deployment Checklist

## Pre-Deployment
- [ ] Code is working locally
- [ ] All dependencies are listed in requirements.txt and package.json
- [ ] Environment variables are documented
- [ ] Git repository is clean and pushed to GitHub

## Database Setup (Neo4j Aura)
- [ ] Neo4j Aura account created
- [ ] Free instance provisioned
- [ ] Connection credentials saved
- [ ] Test connection successful
- [ ] Data loaded to Aura instance

## Backend Deployment (Railway/Render)
- [ ] Railway/Render account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set:
  - [ ] NEO4J_URI
  - [ ] NEO4J_USERNAME
  - [ ] NEO4J_PASSWORD
  - [ ] GEMINI_API_KEY
  - [ ] FLASK_ENV=production
  - [ ] FRONTEND_URL
- [ ] Deployment successful
- [ ] Health check endpoint working
- [ ] API endpoints responding

## Frontend Deployment (Vercel)
- [ ] Vercel account created
- [ ] Repository connected
- [ ] Build settings configured (Vite)
- [ ] Environment variables set:
  - [ ] VITE_API_URL
  - [ ] VITE_USE_MOCK_AUTH (optional)
- [ ] Deployment successful
- [ ] Application loads correctly

## API Keys & External Services
- [ ] Google Gemini API key obtained
- [ ] Firebase project configured
- [ ] Authentication enabled
- [ ] Firestore database setup

## Post-Deployment Testing
- [ ] Frontend loads without errors
- [ ] Authentication works
- [ ] API calls successful
- [ ] Dashboard displays correctly
- [ ] Analysis can be triggered
- [ ] Alerts are generated
- [ ] Investigation workspace functional
- [ ] PDF reports generate
- [ ] Graph visualization works

## Security & Performance
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic with platforms)
- [ ] Environment variables secured
- [ ] No sensitive data in repository
- [ ] Performance acceptable

## Documentation & Monitoring
- [ ] Deployment URLs documented
- [ ] API documentation updated
- [ ] Error monitoring setup (optional)
- [ ] Usage analytics configured (optional)

## Final Steps
- [ ] Update README with live URLs
- [ ] Share access with team members
- [ ] Create backup of configuration
- [ ] Document any custom configurations

## Troubleshooting Common Issues

### CORS Errors
- Check FRONTEND_URL environment variable
- Verify allowed origins in backend

### Database Connection Issues
- Verify Neo4j Aura credentials
- Check URI format (neo4j+s://)
- Ensure instance is running

### Build Failures
- Check all dependencies are listed
- Verify Node.js/Python versions
- Review build logs for specific errors

### API Errors
- Check environment variables
- Review application logs
- Test individual endpoints

## Live URLs (Update after deployment)
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.up.railway.app
- API Health: https://your-backend.up.railway.app/api/health

## Deployment Complete! 🎉
Your Project NETRA is now live and ready for users!
