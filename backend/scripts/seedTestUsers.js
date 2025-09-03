const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../dist/models/User').default;
require('dotenv').config();

const testUsers = [
  {
    name: 'Alex Rodriguez',
    email: 'alex.guitar@test.com',
    password: 'test123',
    age: 25,
    bio: 'Lead guitarist with 8 years of experience. Love rock, blues, and metal. Looking to form a serious band or collaborate on original music.',
    location: {
      city: 'Los Angeles',
      state: 'California',
      country: 'USA'
    },
    skills: [
      { name: 'Guitarist', level: 'Advanced', yearsOfExperience: 8 },
      { name: 'Songwriter', level: 'Intermediate', yearsOfExperience: 5 }
    ],
    genres: ['Rock', 'Blues', 'Metal'],
    lookingFor: ['Band Members', 'Collaboration Partners', 'Recording Partners'],
    socialLinks: {
      spotify: 'https://spotify.com/alexguitar',
      instagram: 'https://instagram.com/alexguitar'
    },
    musicLinks: {
      spotifyTrack: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
      youtubeVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.vocals@test.com',
    password: 'test123',
    age: 23,
    bio: 'Pop singer and songwriter with a passion for creating catchy melodies. I have a versatile voice and love collaborating with producers.',
    location: {
      city: 'Nashville',
      state: 'Tennessee',
      country: 'USA'
    },
    skills: [
      { name: 'Singer', level: 'Professional', yearsOfExperience: 10 },
      { name: 'Songwriter', level: 'Advanced', yearsOfExperience: 6 }
    ],
    genres: ['Pop', 'R&B', 'Soul'],
    lookingFor: ['Producers', 'Songwriting Partners', 'Recording Partners'],
    socialLinks: {
      spotify: 'https://spotify.com/sarahchen',
      youtube: 'https://youtube.com/sarahchenmusic'
    },
    musicLinks: {
      spotifyTrack: 'https://open.spotify.com/track/1r9xUipOqoNwt0VMuBdB4Z',
      soundcloudTrack: 'https://soundcloud.com/sarahchen/demo-track'
    }
  },
  {
    name: 'Mike Johnson',
    email: 'mike.drums@test.com',
    password: 'test123',
    age: 29,
    bio: 'Jazz drummer with classical training. I love complex rhythms and improvisation. Always down for jam sessions!',
    location: {
      city: 'New York',
      state: 'New York',
      country: 'USA'
    },
    skills: [
      { name: 'Drummer', level: 'Professional', yearsOfExperience: 12 },
      { name: 'Composer', level: 'Intermediate', yearsOfExperience: 4 }
    ],
    genres: ['Jazz', 'Blues', 'Funk'],
    lookingFor: ['Band Members', 'Jam Sessions', 'Performance Partners'],
    socialLinks: {
      soundcloud: 'https://soundcloud.com/mikejazzdrums'
    },
    musicLinks: {
      soundcloudTrack: 'https://soundcloud.com/mikejazzdrums/jazz-fusion-improv',
      youtubeVideo: 'https://www.youtube.com/watch?v=PHdU5sHigYA'
    }
  },
  {
    name: 'Emma Williams',
    email: 'emma.producer@test.com',
    password: 'test123',
    age: 27,
    bio: 'Hip hop producer specializing in trap beats and R&B. I have my own studio and love working with vocalists and rappers.',
    location: {
      city: 'Atlanta',
      state: 'Georgia',
      country: 'USA'
    },
    skills: [
      { name: 'Producer', level: 'Professional', yearsOfExperience: 9 },
      { name: 'Sound Engineer', level: 'Advanced', yearsOfExperience: 7 }
    ],
    genres: ['Hip Hop', 'R&B', 'Electronic'],
    lookingFor: ['Collaboration Partners', 'Session Musicians', 'Recording Partners'],
    socialLinks: {
      soundcloud: 'https://soundcloud.com/emmabeats',
      instagram: 'https://instagram.com/emmaproducer'
    },
    musicLinks: {
      spotifyTrack: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
      soundcloudTrack: 'https://soundcloud.com/emmabeats/trap-beat-demo'
    }
  },
  {
    name: 'James Thompson',
    email: 'james.bass@test.com',
    password: 'test123',
    age: 31,
    bio: 'Rock bassist with punk and alternative influences. I bring the groove and energy to any band. Let\'s make some noise!',
    location: {
      city: 'Seattle',
      state: 'Washington',
      country: 'USA'
    },
    skills: [
      { name: 'Bassist', level: 'Advanced', yearsOfExperience: 13 }
    ],
    genres: ['Rock', 'Punk', 'Alternative'],
    lookingFor: ['Band Members', 'Performance Partners', 'Jam Sessions'],
    socialLinks: {
      instagram: 'https://instagram.com/jamesbasslines'
    },
    musicLinks: {
      spotifyTrack: 'https://open.spotify.com/track/0VjIjW4GlULA7m5E7FyLyC',
      youtubeVideo: 'https://www.youtube.com/watch?v=bR-s4ReIxJo'
    }
  },
  {
    name: 'Lily Zhang',
    email: 'lily.piano@test.com',
    password: 'test123',
    age: 24,
    bio: 'Classically trained pianist with a love for jazz and contemporary music. I enjoy both solo performances and collaborations.',
    location: {
      city: 'San Francisco',
      state: 'California',
      country: 'USA'
    },
    skills: [
      { name: 'Pianist', level: 'Professional', yearsOfExperience: 16 },
      { name: 'Composer', level: 'Advanced', yearsOfExperience: 8 }
    ],
    genres: ['Classical', 'Jazz', 'Pop'],
    lookingFor: ['Collaboration Partners', 'Performance Partners', 'Mentorship'],
    socialLinks: {
      youtube: 'https://youtube.com/lilyzhangpiano',
      spotify: 'https://spotify.com/lilyzhang'
    },
    musicLinks: {
      spotifyTrack: 'https://open.spotify.com/track/7BKLCZ1jbUBVqRi2FVlTVw',
      youtubeVideo: 'https://www.youtube.com/watch?v=4Tr0otuiQuU'
    }
  },
  {
    name: 'Carlos Martinez',
    email: 'carlos.rapper@test.com',
    password: 'test123',
    age: 26,
    bio: 'Bilingual rapper with Latin influences. I write my own lyrics and love storytelling through music. Always looking for fresh beats.',
    location: {
      city: 'Miami',
      state: 'Florida',
      country: 'USA'
    },
    skills: [
      { name: 'Rapper', level: 'Advanced', yearsOfExperience: 7 },
      { name: 'Songwriter', level: 'Advanced', yearsOfExperience: 7 }
    ],
    genres: ['Hip Hop', 'Latin', 'Reggae'],
    lookingFor: ['Producers', 'Collaboration Partners', 'Recording Partners'],
    socialLinks: {
      soundcloud: 'https://soundcloud.com/carlosmcrap',
      instagram: 'https://instagram.com/carlosmc'
    },
    musicLinks: {
      soundcloudTrack: 'https://soundcloud.com/carlosmcrap/freestyle-friday',
      youtubeVideo: 'https://www.youtube.com/watch?v=_JZom_gVfuw'
    }
  },
  {
    name: 'Sophie Anderson',
    email: 'sophie.violin@test.com',
    password: 'test123',
    age: 22,
    bio: 'Violinist trained in classical but exploring folk and world music. I love adding strings to different genres of music.',
    location: {
      city: 'Boston',
      state: 'Massachusetts',
      country: 'USA'
    },
    skills: [
      { name: 'Violinist', level: 'Advanced', yearsOfExperience: 14 }
    ],
    genres: ['Classical', 'Folk', 'World'],
    lookingFor: ['Collaboration Partners', 'Session Musicians', 'Performance Partners'],
    socialLinks: {
      youtube: 'https://youtube.com/sophieviolinist'
    },
    musicLinks: {
      youtubeVideo: 'https://www.youtube.com/watch?v=jGflUbPQfW8',
      spotifyTrack: 'https://open.spotify.com/track/1ZHih7yJQKYiZBqYtZZJNl'
    }
  },
  {
    name: 'Ryan Park',
    email: 'ryan.dj@test.com',
    password: 'test123',
    age: 28,
    bio: 'Electronic music producer and DJ. I specialize in house, techno, and ambient music. Let\'s create some electronic magic together!',
    location: {
      city: 'Chicago',
      state: 'Illinois',
      country: 'USA'
    },
    skills: [
      { name: 'DJ', level: 'Professional', yearsOfExperience: 10 },
      { name: 'Producer', level: 'Advanced', yearsOfExperience: 8 }
    ],
    genres: ['Electronic', 'Pop', 'Other'],
    lookingFor: ['Collaboration Partners', 'Performance Partners', 'Producers'],
    socialLinks: {
      soundcloud: 'https://soundcloud.com/ryanparkdj',
      spotify: 'https://spotify.com/ryanpark'
    },
    musicLinks: {
      soundcloudTrack: 'https://soundcloud.com/ryanparkdj/electronic-mix-2024',
      spotifyTrack: 'https://open.spotify.com/track/6DCZcSspjsKoFjzjrWoCdn'
    }
  },
  {
    name: 'Zoe Mitchell',
    email: 'zoe.songwriter@test.com',
    password: 'test123',
    age: 25,
    bio: 'Indie singer-songwriter with folk influences. I write introspective lyrics and play acoustic guitar. Looking for musicians to bring my songs to life.',
    location: {
      city: 'Portland',
      state: 'Oregon',
      country: 'USA'
    },
    skills: [
      { name: 'Singer', level: 'Intermediate', yearsOfExperience: 6 },
      { name: 'Songwriter', level: 'Advanced', yearsOfExperience: 8 },
      { name: 'Guitarist', level: 'Intermediate', yearsOfExperience: 6 }
    ],
    genres: ['Indie', 'Folk', 'Alternative'],
    lookingFor: ['Band Members', 'Collaboration Partners', 'Recording Partners'],
    socialLinks: {
      spotify: 'https://spotify.com/zoemitchell',
      instagram: 'https://instagram.com/zoemusic'
    },
    musicLinks: {
      spotifyTrack: 'https://open.spotify.com/track/2takcwOaAZWiXQijPHIx7B',
      youtubeVideo: 'https://www.youtube.com/watch?v=09R8_2nJtjg'
    }
  }
];

async function seedTestUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/musiccollab';
    console.log('Attempting to connect to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ email: { $regex: '@test.com$' } });
    console.log('Cleared existing test users');

    // Create test users
    for (const userData of testUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(12);
      userData.password = await bcrypt.hash(userData.password, salt);
      
      const user = new User(userData);
      await user.save();
      console.log(`Created test user: ${userData.name} (${userData.email})`);
    }

    console.log('\n✅ Successfully created 10 test users!');
    console.log('\nTest user credentials (all passwords are "test123"):');
    testUsers.forEach(user => {
      console.log(`- ${user.name}: ${user.email}`);
    });

  } catch (error) {
    console.error('Error seeding test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed function
seedTestUsers();
