import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  yearsOfExperience: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  bio: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  profilePictures: string[];
  skills: ISkill[];
  genres: string[];
  lookingFor: string[];
  socialLinks: {
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
    instagram?: string;
  };
  musicLinks: {
    spotifyTrack?: string;    // Spotify track/playlist URL for preview
    soundcloudTrack?: string; // SoundCloud track URL for preview
    youtubeVideo?: string;    // YouTube video URL for preview
  };
  isActive: boolean;
  lastSeen: Date;
  swipedRight: mongoose.Types.ObjectId[];
  swipedLeft: mongoose.Types.ObjectId[];
  matches: mongoose.Types.ObjectId[];
  pendingLikes: mongoose.Types.ObjectId[]; // Users who liked this user but haven't been responded to
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const SkillSchema = new Schema<ISkill>({
  name: {
    type: String,
    required: true,
    enum: [
      'Singer', 'Guitarist', 'Bassist', 'Drummer', 'Pianist', 'Keyboardist',
      'Producer', 'DJ', 'Songwriter', 'Composer', 'Sound Engineer',
      'Violinist', 'Saxophonist', 'Trumpeter', 'Flutist', 'Cellist',
      'Rapper', 'Beatboxer', 'Other'
    ]
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional']
  },
  yearsOfExperience: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
    max: 50
  }
});

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  profilePictures: [{
    type: String,
    validate: {
      validator: function(v: string[]) {
        return v.length <= 6;
      },
      message: 'Maximum 6 profile pictures allowed'
    }
  }],
  skills: {
    type: [SkillSchema],
    required: true,
    validate: {
      validator: function(v: ISkill[]) {
        return v.length > 0 && v.length <= 5;
      },
      message: 'Must have at least 1 skill and maximum 5 skills'
    }
  },
  genres: [{
    type: String,
    enum: [
      'Rock', 'Pop', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic',
      'Country', 'Folk', 'Blues', 'Reggae', 'Punk', 'Metal', 'Indie',
      'Alternative', 'Soul', 'Funk', 'Gospel', 'Latin', 'World', 'Other'
    ]
  }],
  lookingFor: [{
    type: String,
    enum: [
      'Band Members', 'Collaboration Partners', 'Session Musicians',
      'Producers', 'Songwriting Partners', 'Performance Partners',
      'Recording Partners', 'Jam Sessions', 'Music Lessons', 'Mentorship'
    ]
  }],
  socialLinks: {
    spotify: { type: String, default: '' },
    soundcloud: { type: String, default: '' },
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  musicLinks: {
    spotifyTrack: { type: String, default: '' },
    soundcloudTrack: { type: String, default: '' },
    youtubeVideo: { type: String, default: '' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  swipedRight: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  swipedLeft: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  matches: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  pendingLikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
