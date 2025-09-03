# 🚀 MusicCollab App Deployment Guide

## Quick Mobile Testing (Option 1 - Recommended)

### Step 1: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to backend folder
   cd backend
   
   # Deploy
   railway deploy
   ```

3. **Set Environment Variables in Railway Dashboard**
   - `PORT=3000`
   - `MONGODB_URI=your_mongodb_atlas_connection_string`
   - `JWT_SECRET=your_jwt_secret_key`
   - `NODE_ENV=production`

4. **Get Your Backend URL**
   - Railway will provide a URL like: `https://your-app-name.railway.app`

### Step 2: Update Frontend API URL

1. **Update API Base URL**
   - Open `services/api.ts`
   - Change `API_BASE_URL` from `http://localhost:3000/api` to `https://your-railway-url.railway.app/api`

### Step 3: Test on Mobile with Expo Go

1. **Install Expo Go App**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Start Development Server**
   ```bash
   # In main project directory
   npm start
   ```

3. **Scan QR Code**
   - Use Expo Go app to scan the QR code
   - App will load on your mobile device

---

## Production Deployment (Option 2)

### Frontend: EAS Build

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   eas login
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for iOS/Android**
   ```bash
   # For iOS (TestFlight)
   eas build --platform ios
   
   # For Android (Play Console)
   eas build --platform android
   ```

### Backend: Production Deployment

- **Railway** (Recommended): Easy, free tier
- **Render**: Alternative free option
- **Heroku**: Paid but reliable
- **DigitalOcean**: VPS option

---

## Environment Variables Needed

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Frontend
- Update `API_BASE_URL` in `services/api.ts`

---

## Testing Checklist

- [ ] Backend health check: `https://your-url.railway.app/api/health`
- [ ] Registration works
- [ ] Login works
- [ ] Swiping works
- [ ] Music player works
- [ ] Profile view works
- [ ] Test users are seeded

---

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Backend CORS is configured for all origins
2. **MongoDB Connection**: Ensure MongoDB Atlas allows all IPs (0.0.0.0/0)
3. **Environment Variables**: Double-check all variables are set correctly
4. **API URL**: Ensure frontend points to deployed backend URL

### Debug Commands:
```bash
# Check backend logs
railway logs

# Test backend health
curl https://your-url.railway.app/api/health

# Test registration
curl -X POST https://your-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","age":25,"location":{"city":"Test","state":"Test","country":"Test"},"skills":[{"name":"Singer","level":"Beginner"}],"genres":["Pop"],"lookingFor":["Band Members"]}'
```
