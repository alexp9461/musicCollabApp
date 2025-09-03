import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get current user profile
// Get potential matches (users to swipe on)
// Get potential matches (users to swipe on)
router.get('/discover', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Get search filters from query parameters
    const { requiredSkills, localOnly, maxDistance } = req.query;

    // Find users that:
    // 1. Are not the current user
    // 2. Haven't been swiped on (left or right) by current user
    // 3. Are active
    const excludeIds = [
      currentUser._id,
      ...currentUser.swipedLeft,
      ...currentUser.swipedRight
    ];

    // Build the query
    let query: any = {
      _id: { $nin: excludeIds },
      isActive: true
    };

    // Add skills filter if specified
    if (requiredSkills && Array.isArray(requiredSkills) && requiredSkills.length > 0) {
      query['skills.name'] = { $in: requiredSkills };
    }

    // Add location filter if localOnly is true
    if (localOnly === 'true') {
      // For now, we'll filter by same city/state
      // In a real app, you'd calculate actual distances
      query['location.city'] = currentUser.location.city;
      query['location.state'] = currentUser.location.state;
    }

    const potentialMatches = await User.find(query)
      .select('-password -swipedLeft -swipedRight -matches')
      .limit(20);

    res.json(potentialMatches);
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ message: 'Error fetching potential matches' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const {
      name,
      age,
      bio,
      location,
      skills,
      genres,
      lookingFor,
      profilePictures,
      socialLinks,
      musicLinks
    } = req.body;

    // Update user fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (bio !== undefined) user.bio = bio;
    if (location) user.location = location;
    if (skills) user.skills = skills;
    if (genres) user.genres = genres;
    if (lookingFor) user.lookingFor = lookingFor;
    if (profilePictures) user.profilePictures = profilePictures;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (musicLinks) user.musicLinks = { ...user.musicLinks, ...musicLinks };

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
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
        musicLinks: user.musicLinks,
        isActive: user.isActive,
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get potential matches (users to swipe on)
router.get('/discover', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Find users that:
    // 1. Are not the current user
    // 2. Haven't been swiped on (left or right) by current user
    // 3. Are active
    const excludeIds = [
      currentUser._id,
      ...currentUser.swipedLeft,
      ...currentUser.swipedRight
    ];

    const potentialMatches = await User.find({
      _id: { $nin: excludeIds },
      isActive: true
    })
    .select('-password -swipedLeft -swipedRight -matches')
    .limit(20);

    res.json(potentialMatches);
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ message: 'Error fetching potential matches' });
  }
});

// Get user by ID (for profile viewing)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = await User.findById(id)
      .select('-password -swipedLeft -swipedRight -matches -pendingLikes');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

export default router;
