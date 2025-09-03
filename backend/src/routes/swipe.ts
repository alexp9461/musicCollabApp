import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Handle swipe action
router.post('/action', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { targetUserId, action } = req.body;

    if (!targetUserId || !action) {
      return res.status(400).json({ message: 'Target user ID and action are required' });
    }

    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({ message: 'Action must be "like" or "pass"' });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if already swiped on this user
    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    const alreadySwiped = currentUser.swipedLeft.includes(targetObjectId) || 
                         currentUser.swipedRight.includes(targetObjectId);

    if (alreadySwiped) {
      return res.status(400).json({ message: 'Already swiped on this user' });
    }

    let isMatch = false;
    let isNewNotification = false;

    if (action === 'like') {
      // Add to swiped right
      currentUser.swipedRight.push(targetObjectId);

      // Check if target user has already liked current user (pending like)
      const currentUserObjectId = currentUser._id as mongoose.Types.ObjectId;
      if (targetUser.pendingLikes && targetUser.pendingLikes.includes(currentUserObjectId)) {
        // It's a match! Both users have liked each other
        isMatch = true;
        
        // Remove from pending likes and add to matches
        targetUser.pendingLikes = targetUser.pendingLikes.filter(id => !id.equals(currentUserObjectId));
        currentUser.matches.push(targetObjectId);
        targetUser.matches.push(currentUserObjectId);
        await targetUser.save();
      } else {
        // Add current user to target user's pending likes (notification)
        if (!targetUser.pendingLikes) {
          targetUser.pendingLikes = [];
        }
        targetUser.pendingLikes.push(currentUserObjectId);
        isNewNotification = true;
        await targetUser.save();
      }
    } else {
      // Add to swiped left
      currentUser.swipedLeft.push(targetObjectId);
      
      // If current user passes on someone who liked them, remove from pending likes
      const currentUserObjectId = currentUser._id as mongoose.Types.ObjectId;
      if (targetUser.pendingLikes && targetUser.pendingLikes.includes(currentUserObjectId)) {
        targetUser.pendingLikes = targetUser.pendingLikes.filter(id => !id.equals(currentUserObjectId));
        await targetUser.save();
      }
    }

    await currentUser.save();

    res.json({
      message: action === 'like' ? 'Liked user' : 'Passed on user',
      isMatch,
      isNewNotification,
      ...(isMatch && {
        matchedUser: {
          _id: targetUser._id,
          name: targetUser.name,
          profilePictures: targetUser.profilePictures,
          skills: targetUser.skills
        }
      })
    });
  } catch (error) {
    console.error('Swipe action error:', error);
    res.status(500).json({ message: 'Error processing swipe action' });
  }
});

// Get user's matches
router.get('/matches', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    const matches = await User.find({
      _id: { $in: currentUser.matches }
    })
    .select('name age bio skills genres profilePictures socialLinks lastSeen')
    .sort({ lastSeen: -1 });

    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Error fetching matches' });
  }
});

// Get pending likes (notifications)
router.get('/pending-likes', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Get all users who have liked this user but haven't been responded to
    const pendingLikes = await User.find({
      _id: { $in: currentUser.pendingLikes || [] }
    }).select('name age bio skills genres location profilePictures');

    res.json({
      pendingLikes,
      count: pendingLikes.length
    });
  } catch (error) {
    console.error('Error getting pending likes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
