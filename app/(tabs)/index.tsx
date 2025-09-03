import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MusicPlayer from '../../components/MusicPlayer';
import { swipeAPI, userAPI } from '../../services/api';
import { User } from '../../types/user';

const { width, height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const discoverUsers = await userAPI.getDiscoverUsers();
      setUsers(discoverUsers);
      setCurrentIndex(0);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (currentIndex >= users.length) return;

    const currentUser = users[currentIndex];
    
    try {
      const response = await swipeAPI.swipeAction(currentUser._id, action);
      
      if (response.isMatch) {
        Alert.alert(
          '🎉 It\'s a Match!',
          `You and ${currentUser.name} both liked each other! Start collaborating now!`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }

      // Move to next user
      setCurrentIndex(currentIndex + 1);
      
      // Load more users if we're near the end
      if (currentIndex >= users.length - 2) {
        loadUsers();
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to process swipe');
    }
  };

  const currentUser = users[currentIndex];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Finding musicians near you...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No more musicians to discover!</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadUsers}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#ff7675', '#fd79a8']}
          style={styles.card}
        >
          {currentUser.profilePictures.length > 0 ? (
            <Image
              source={{ uri: currentUser.profilePictures[0] }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={100} color="rgba(255,255,255,0.5)" />
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.overlay}
          >
            <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.name}>{currentUser.name}, {currentUser.age}</Text>
              <Text style={styles.location}>
                {currentUser.location.city}, {currentUser.location.state}
              </Text>
              
              <View style={styles.skillsContainer}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {currentUser.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>
                      {skill.name} - {skill.level}
                    </Text>
                  </View>
                ))}
              </View>

              {currentUser.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  <Text style={styles.sectionTitle}>Genres</Text>
                  <View style={styles.chipContainer}>
                    {currentUser.genres.map((genre, index) => (
                      <View key={index} style={styles.genreChip}>
                        <Text style={styles.genreText}>{genre}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {currentUser.bio && (
                <View style={styles.bioContainer}>
                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.bioText}>{currentUser.bio}</Text>
                </View>
              )}

              <MusicPlayer
                spotifyTrack={currentUser.musicLinks?.spotifyTrack}
                soundcloudTrack={currentUser.musicLinks?.soundcloudTrack}
                youtubeVideo={currentUser.musicLinks?.youtubeVideo}
                compact={true}
              />
            </ScrollView>
          </LinearGradient>
        </LinearGradient>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe('pass')}
        >
          <Ionicons name="close" size={30} color="#ff6b6b" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.profileButton]}
          onPress={() => router.push(`/profile/${currentUser._id}`)}
        >
          <Ionicons name="person" size={30} color="#74b9ff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe('like')}
        >
          <Ionicons name="heart" size={30} color="#00b894" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  profileImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  skillsContainer: {
    marginBottom: 15,
  },
  skillChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  skillText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  genresContainer: {
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  genreText: {
    color: 'white',
    fontSize: 12,
  },
  bioContainer: {
    marginBottom: 15,
  },
  bioText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingBottom: 30,
    gap: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  passButton: {
    backgroundColor: 'white',
  },
  profileButton: {
    backgroundColor: 'white',
  },
  likeButton: {
    backgroundColor: 'white',
  },
});
