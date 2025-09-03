import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      bio,
      location,
      skills,
      genres,
      lookingFor
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate required fields
    if (!name || !email || !password || !age || !location || !skills) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      age,
      bio: bio || '',
      location,
      skills,
      genres: genres || [],
      lookingFor: lookingFor || [],
      profilePictures: [],
      socialLinks: {}
    });

    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      bio: user.bio,
      location: user.location,
      skills: user.skills,
      genres: user.genres,
      lookingFor: user.lookingFor,
      profilePictures: user.profilePictures,
      socialLinks: user.socialLinks,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      bio: user.bio,
      location: user.location,
      skills: user.skills,
      genres: user.genres,
      lookingFor: user.lookingFor,
      profilePictures: user.profilePictures,
      socialLinks: user.socialLinks,
      isActive: user.isActive,
      lastSeen: user.lastSeen
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

export default router;
