export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  yearsOfExperience: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  profilePictures: string[];
  skills: Skill[];
  genres: string[];
  lookingFor: string[];
  socialLinks: {
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
    instagram?: string;
  };
  musicLinks: {
    spotifyTrack?: string;
    soundcloudTrack?: string;
    youtubeVideo?: string;
  };
  isActive: boolean;
  lastSeen: Date;
  matches?: string[];
  pendingLikes?: string[];
  createdAt: Date;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
