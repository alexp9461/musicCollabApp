import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { swipeAPI } from '../../services/api';
import { User } from '../../types/user';

const { width } = Dimensions.get('window');

export default function MatchesScreen() {
  const [matches, setMatches] = useState<User[]>([]);
  const [pendingLikes, setPendingLikes] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'notifications'>('matches');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [userMatches, userPendingLikes] = await Promise.all([
        swipeAPI.getMatches(),
        swipeAPI.getPendingLikes()
      ]);
      setMatches(userMatches);
      setPendingLikes(userPendingLikes.pendingLikes);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeback = async (userId: string) => {
    try {
      const result = await swipeAPI.swipeAction(userId, 'like');
      if (result.isMatch) {
        Alert.alert('🎉 It\'s a Match!', 'You both liked each other!');
        loadData(); // Refresh data
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to respond to like');
    }
  };

  const handlePass = async (userId: string) => {
    try {
      await swipeAPI.swipeAction(userId, 'pass');
      loadData(); // Refresh data
    } catch (error) {
      Alert.alert('Error', 'Failed to respond');
    }
  };

  const renderMatch = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.matchCard}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.cardGradient}
      >
        {item.profilePictures && item.profilePictures.length > 0 ? (
          <Image
            source={{ uri: item.profilePictures[0] }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={40} color="rgba(255,255,255,0.7)" />
          </View>
        )}
        
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.name}</Text>
          <Text style={styles.matchSkills}>
            {item.skills.map(skill => skill.name).join(', ')}
          </Text>
          {item.genres && item.genres.length > 0 && (
            <Text style={styles.matchGenres}>
              {item.genres.slice(0, 2).join(', ')}
              {item.genres.length > 2 && '...'}
            </Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPendingLike = ({ item }: { item: User }) => (
    <View style={styles.notificationCard}>
      <LinearGradient
        colors={['#ff6b6b', '#ee5a52']}
        style={styles.cardGradient}
      >
        {item.profilePictures && item.profilePictures.length > 0 ? (
          <Image
            source={{ uri: item.profilePictures[0] }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={40} color="rgba(255,255,255,0.7)" />
          </View>
        )}
        
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.name} likes you! 💕</Text>
          <Text style={styles.matchSkills}>
            {item.skills.map(skill => skill.name).join(', ')}
          </Text>
          {item.genres && item.genres.length > 0 && (
            <Text style={styles.matchGenres}>
              {item.genres.slice(0, 2).join(', ')}
              {item.genres.length > 2 && '...'}
            </Text>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => handleLikeback(item._id)}
          >
            <Ionicons name="heart" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.passButton}
            onPress={() => handlePass(item._id)}
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connections</Text>
        
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
            onPress={() => setActiveTab('matches')}
          >
            <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
              Matches ({matches.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
            onPress={() => setActiveTab('notifications')}
          >
            <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
              Likes ({pendingLikes.length})
            </Text>
            {pendingLikes.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingLikes.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'matches' ? (
        matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No matches yet!</Text>
            <Text style={styles.emptySubtext}>
              Keep swiping to find your musical partners
            </Text>
          </View>
        ) : (
          <FlatList
            data={matches}
            renderItem={renderMatch}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        pendingLikes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No likes yet!</Text>
            <Text style={styles.emptySubtext}>
              When someone likes your profile, they'll appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={pendingLikes}
            renderItem={renderPendingLike}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )
      )}
    </View>
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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  badge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  matchCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  matchSkills: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  matchGenres: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  notificationCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  likeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
