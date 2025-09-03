# MongoDB Setup Guide

You have two options to get MongoDB running for the Music Collab App:

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update your `.env` file with: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/musiccollab`

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service automatically
4. Use connection string: `mongodb://localhost:27017/musiccollab`

### Quick Test:
Run this command to test your connection:
```bash
npm run seed
```

## Current Status
- The seed script is ready with 10 test users
- Each test user has different musical skills and genres
- All test users use password: "test123"
- The login screen has a "Use Test User" button for easy testing
