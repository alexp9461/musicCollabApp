import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadUserProfile(id);
    }
  }, [id]);

  const loadUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const userProfile = await userAPI.getUserById(userId);
      setUser(userProfile);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load user profile');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (!user) return;

    try {
      const response = await swipeAPI.swipeAction(user._id, action);
      
      if (response.isMatch) {
        Alert.alert(
          '🎉 It\'s a Match!',
          `You and ${user.name} both liked each other! Start collaborating now!`,
          [{ text: 'Awesome!', onPress: () => router.back() }]
        );
      } else {
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to process action');
    }
  };

  const nextImage = () => {
    if (user && user.profilePictures.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === user.profilePictures.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (user && user.profilePictures.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? user.profilePictures.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingContainer}>
        <Text style={styles.loadingText}>User not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Photo Gallery */}
          <View style={styles.photoContainer}>
            {user.profilePictures && user.profilePictures.length > 0 ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: user.profilePictures[currentImageIndex] }}
                  style={styles.profileImage}
                />
                
                {user.profilePictures.length > 1 && (
                  <>
                    <TouchableOpacity 
                      style={[styles.imageNav, styles.imageNavLeft]} 
                      onPress={prevImage}
                    >
                      <Ionicons name="chevron-back" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.imageNav, styles.imageNavRight]} 
                      onPress={nextImage}
                    >
                      <Ionicons name="chevron-forward" size={30} color="white" />
                    </TouchableOpacity>
                    
                    <View style={styles.imageIndicators}>
                      {user.profilePictures.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.indicator,
                            index === currentImageIndex && styles.activeIndicator
                          ]}
                        />
                      ))}
                    </View>
                  </>
                )}
              </View>
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={120} color="rgba(255,255,255,0.5)" />
              </View>
            )}
          </View>

          {/* User Info */}
          <View style={styles.infoSection}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.location}>
              <Ionicons name="location" size={16} color="rgba(255,255,255,0.8)" />
              {' '}{user.location.city}, {user.location.state}
            </Text>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Skills & Experience</Text>
            <View style={styles.skillsGrid}>
              {user.skills.map((skill, index) => (
                <View key={index} style={styles.skillCard}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevel}>{skill.level}</Text>
                  {skill.yearsOfExperience > 0 && (
                    <Text style={styles.skillYears}>
                      {skill.yearsOfExperience} years
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Genres */}
          {user.genres && user.genres.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎵 Musical Genres</Text>
              <View style={styles.genresContainer}>
                {user.genres.map((genre, index) => (
                  <View key={index} style={styles.genreChip}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Looking For */}
          {user.lookingFor && user.lookingFor.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔍 Looking For</Text>
              <View style={styles.lookingForContainer}>
                {user.lookingFor.map((item, index) => (
                  <View key={index} style={styles.lookingForChip}>
                    <Text style={styles.lookingForText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Bio */}
          {user.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 About Me</Text>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          )}

          {/* Music Player */}
          <View style={styles.section}>
            <MusicPlayer
              spotifyTrack={user.musicLinks?.spotifyTrack}
              soundcloudTrack={user.musicLinks?.soundcloudTrack}
              youtubeVideo={user.musicLinks?.youtubeVideo}
              compact={false}
            />
          </View>

          {/* Spacer for action buttons */}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => handleSwipe('pass')}
          >
            <Ionicons name="close" size={32} color="#ff6b6b" />
            <Text style={styles.actionButtonText}>Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => handleSwipe('like')}
          >
            <Ionicons name="heart" size={32} color="#00b894" />
            <Text style={styles.actionButtonText}>Like</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  photoContainer: {
    height: height * 0.5,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNav: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNavLeft: {
    left: 10,
  },
  imageNavRight: {
    right: 10,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  name: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 15,
    minWidth: (width - 60) / 2 - 6,
    alignItems: 'center',
  },
  skillName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  skillLevel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 2,
  },
  skillYears: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  lookingForContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lookingForChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  lookingForText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  bioText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  spacer: {
    height: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionButton: {
    width: 120,
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
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  passButton: {
    backgroundColor: 'rgba(255,107,107,0.9)',
  },
  likeButton: {
    backgroundColor: 'rgba(0,184,148,0.9)',
  },
});
