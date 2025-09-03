import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface MusicPlayerProps {
  spotifyTrack?: string;
  soundcloudTrack?: string;
  youtubeVideo?: string;
  compact?: boolean; // For swipe cards
}

const { width } = Dimensions.get('window');

export default function MusicPlayer({
  spotifyTrack,
  soundcloudTrack,
  youtubeVideo,
  compact = false
}: MusicPlayerProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract embed URLs from regular URLs
  const getSpotifyEmbedUrl = (url: string) => {
    // Convert Spotify URLs to embed format
    if (url.includes('open.spotify.com')) {
      const trackId = url.split('/').pop()?.split('?')[0];
      if (trackId) {
        return `https://open.spotify.com/embed/track/${trackId}`;
      }
    }
    return url;
  };

  const getSoundCloudEmbedUrl = (url: string) => {
    // SoundCloud embed format
    if (url.includes('soundcloud.com')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    }
    return url;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract YouTube video ID and create embed URL
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`;
    }
    return url;
  };

  const openInApp = async (url: string, platform: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${platform} link`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${platform} link`);
    }
  };

  const availablePlatforms = [
    { key: 'spotify', url: spotifyTrack, name: 'Spotify', icon: 'musical-notes', color: '#1DB954' },
    { key: 'soundcloud', url: soundcloudTrack, name: 'SoundCloud', icon: 'cloud', color: '#FF5500' },
    { key: 'youtube', url: youtubeVideo, name: 'YouTube', icon: 'play', color: '#FF0000' },
  ].filter(platform => platform.url && platform.url.trim() !== '');

  if (availablePlatforms.length === 0) {
    return null;
  }

  const renderCompactPlayer = () => (
    <View style={styles.compactContainer}>
      <Text style={styles.compactTitle}>🎵 Music</Text>
      <View style={styles.platformButtons}>
        {availablePlatforms.map(platform => (
          <TouchableOpacity
            key={platform.key}
            style={[styles.platformButton, { backgroundColor: platform.color }]}
            onPress={() => openInApp(platform.url!, platform.name)}
          >
            <Ionicons name={platform.icon as any} size={16} color="white" />
            <Text style={styles.platformButtonText}>{platform.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFullPlayer = () => (
    <View style={styles.fullContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Music Player</Text>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <>
          <View style={styles.platformSelector}>
            {availablePlatforms.map(platform => (
              <TouchableOpacity
                key={platform.key}
                style={[
                  styles.selectorButton,
                  selectedPlatform === platform.key && styles.selectedButton,
                  { borderColor: platform.color }
                ]}
                onPress={() => setSelectedPlatform(platform.key)}
              >
                <Ionicons name={platform.icon as any} size={20} color={platform.color} />
                <Text style={[styles.selectorText, { color: platform.color }]}>
                  {platform.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedPlatform && (
            <View style={styles.playerContainer}>
              {selectedPlatform === 'spotify' && spotifyTrack && (
                <WebView
                  source={{ uri: getSpotifyEmbedUrl(spotifyTrack) }}
                  style={styles.webView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              )}
              
              {selectedPlatform === 'soundcloud' && soundcloudTrack && (
                <WebView
                  source={{ uri: getSoundCloudEmbedUrl(soundcloudTrack) }}
                  style={styles.webView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              )}
              
              {selectedPlatform === 'youtube' && youtubeVideo && (
                <WebView
                  source={{ uri: getYouTubeEmbedUrl(youtubeVideo) }}
                  style={styles.webView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                />
              )}

              <TouchableOpacity
                style={styles.openAppButton}
                onPress={() => {
                  const platform = availablePlatforms.find(p => p.key === selectedPlatform);
                  if (platform) {
                    openInApp(platform.url!, platform.name);
                  }
                }}
              >
                <Text style={styles.openAppText}>Open in App</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );

  return compact ? renderCompactPlayer() : renderFullPlayer();
}

const styles = StyleSheet.create({
  // Compact player styles (for swipe cards)
  compactContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  compactTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  platformButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  platformButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Full player styles
  fullContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandButton: {
    padding: 4,
  },
  platformSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  playerContainer: {
    padding: 16,
    gap: 12,
  },
  webView: {
    height: 200,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  openAppButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  openAppText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
