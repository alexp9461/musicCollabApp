# Music Collab App 🎵

A Tinder-style mobile app for musicians to find collaboration partners, built with React Native (Expo) and Node.js.

## Features

- **User Authentication**: Secure registration and login system
- **Musician Profiles**: Detailed profiles with skills, experience levels, genres, and bio
- **Tinder-Style Swiping**: Discover and connect with other musicians
- **Smart Matching**: Get matched when both users like each other
- **Skill-Based Discovery**: Find musicians based on their instruments and skills
- **Location-Based**: Connect with musicians in your area

## Tech Stack

### Frontend (Mobile App)
- React Native with Expo
- TypeScript
- Expo Router for navigation
- React Navigation
- Linear Gradients for UI
- AsyncStorage for local data

### Backend (API)
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS and security middleware

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/musiccollab
   JWT_SECRET=your_secure_jwt_secret_here
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Mobile App Setup

1. In the main directory, install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

3. Use the Expo Go app on your phone to scan the QR code, or run on simulator:
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS (macOS only)
   ```

## User Data Model

Each user profile includes:

- **Basic Info**: Name, email, age, location
- **Skills**: Musical instruments/roles with experience levels
- **Genres**: Preferred music genres
- **Bio**: Personal description
- **Looking For**: Types of collaboration sought
- **Social Links**: Spotify, SoundCloud, YouTube, Instagram
- **Profile Pictures**: Up to 6 photos

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/discover` - Get potential matches

### Swiping & Matching
- `POST /api/swipe/action` - Swipe left/right on a user
- `GET /api/swipe/matches` - Get user's matches

## Skill Categories

The app supports various musical skills:
- **Instruments**: Guitar, Bass, Drums, Piano, Violin, Saxophone, etc.
- **Vocals**: Singer, Rapper, Beatboxer
- **Production**: Producer, DJ, Sound Engineer
- **Composition**: Songwriter, Composer

## Experience Levels
- Beginner
- Intermediate  
- Advanced
- Professional

## Future Enhancements

- Real-time chat messaging
- Audio/video sharing
- Event creation and discovery
- Band formation tools
- Skill verification system
- Advanced filtering options

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own music collaboration app!