import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/user';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          {user.profilePictures.length > 0 ? (
            <Image
              source={{ uri: user.profilePictures[0] }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={60} color="rgba(255,255,255,0.7)" />
            </View>
          )}
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{user.name}, {user.age}</Text>
        <Text style={styles.location}>
          {user.location.city}, {user.location.state}, {user.location.country}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {user.skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>{skill.level}</Text>
              </View>
              <Text style={styles.skillExperience}>
                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
              </Text>
            </View>
          ))}
        </View>

        {user.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Genres</Text>
            <View style={styles.chipContainer}>
              {user.genres.map((genre, index) => (
                <View key={index} style={styles.genreChip}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {user.lookingFor.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <View style={styles.chipContainer}>
              {user.lookingFor.map((item, index) => (
                <View key={index} style={styles.lookingForChip}>
                  <Text style={styles.lookingForText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          {Object.entries(user.socialLinks).map(([platform, url]) => (
            url ? (
              <View key={platform} style={styles.socialItem}>
                <Ionicons 
                  name={platform === 'spotify' ? 'musical-notes' : 
                        platform === 'soundcloud' ? 'cloud' :
                        platform === 'youtube' ? 'play' : 'logo-instagram'} 
                  size={20} 
                  color="#667eea" 
                />
                <Text style={styles.socialText}>{platform}: {url}</Text>
              </View>
            ) : null
          ))}
        </View>

        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  skillLevel: {
    fontSize: 14,
    color: '#666',
  },
  skillExperience: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  genreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  lookingForChip: {
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lookingForText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  editProfileButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  editProfileText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 30,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
