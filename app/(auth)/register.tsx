import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomPicker from '../../components/CustomPicker';
import { useAuth } from '../../contexts/AuthContext';

const SKILL_OPTIONS = [
  'Singer', 'Guitarist', 'Bassist', 'Drummer', 'Pianist', 'Keyboardist',
  'Producer', 'DJ', 'Songwriter', 'Composer', 'Sound Engineer',
  'Violinist', 'Saxophonist', 'Trumpeter', 'Flutist', 'Cellist',
  'Rapper', 'Beatboxer', 'Other'
];

const GENRE_OPTIONS = [
  'Rock', 'Pop', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic',
  'Country', 'Folk', 'Blues', 'Reggae', 'Punk', 'Metal', 'Indie',
  'Alternative', 'Soul', 'Funk', 'Gospel', 'Latin', 'World', 'Other'
];

export default function RegisterScreen() {
  console.log('📱 RegisterScreen component loaded');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    bio: '',
    location: {
      city: '',
      state: '',
      country: '',
    },
    skills: [{
      name: '',
      level: '',
      yearsOfExperience: 0,
    }],
    genres: [] as string[],
    lookingFor: [] as string[],
    musicLinks: {
      spotifyTrack: '',
      soundcloudTrack: '',
      youtubeVideo: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('📱 Getting register function from useAuth...');
  const { register } = useAuth();
  console.log('📱 Register function:', typeof register);

  const handleRegister = async () => {
    console.log('🚨 BUTTON CLICKED - handleRegister called!');
    console.log('🚨 Form data:', formData);
    
    // Detailed validation with logging
    console.log('🔍 Checking name:', formData.name);
    console.log('🔍 Checking email:', formData.email);
    console.log('🔍 Checking password:', formData.password ? 'has password' : 'no password');
    console.log('🔍 Checking age:', formData.age);
    
    if (!formData.name || !formData.email || !formData.password || !formData.age) {
      console.log('❌ Validation failed - missing required fields');
      console.log('Missing fields:', {
        name: !formData.name,
        email: !formData.email,
        password: !formData.password,
        age: !formData.age
      });
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    console.log('✅ Basic fields validation passed');

    if (formData.password !== formData.confirmPassword) {
      console.log('❌ Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    console.log('✅ Password confirmation passed');

    if (parseInt(formData.age) < 18) {
      console.log('❌ Age validation failed:', formData.age);
      Alert.alert('Error', 'You must be at least 18 years old');
      return;
    }
    console.log('✅ Age validation passed');

    console.log('🔍 Checking location:', formData.location);
    if (!formData.location.city || !formData.location.state || !formData.location.country) {
      console.log('❌ Location validation failed');
      Alert.alert('Error', 'Please fill in your location');
      return;
    }
    console.log('✅ Location validation passed');

    console.log('🔍 Checking skills:', formData.skills[0]);
    if (!formData.skills[0].name || !formData.skills[0].level) {
      console.log('❌ Skills validation failed');
      Alert.alert('Error', 'Please select your primary skill and experience level');
      return;
    }
    console.log('✅ Skills validation passed');
    
    console.log('🎉 ALL VALIDATION PASSED - proceeding to registration...');

    try {
      setIsLoading(true);
      
      const registrationData = {
        ...formData,
        age: parseInt(formData.age),
      };
      
      console.log('📝 Registration data:', JSON.stringify(registrationData, null, 2));
      
      await register(registrationData);
      
      console.log('✅ Registration successful');
      Alert.alert('Success!', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'Something went wrong';
      
      if (error.response) {
        console.error('Response error:', error.response.data);
        errorMessage = error.response.data?.message || 'Server error occurred';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSkill = (index: number, field: string, value: any) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setFormData({ ...formData, skills: newSkills });
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Join Music Collab</Text>
            
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Email *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm Password *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Age *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                keyboardType="numeric"
              />

              <View style={styles.locationContainer}>
                <Text style={styles.sectionTitle}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.location.city}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: text }
                  })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="State/Province"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.location.state}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: text }
                  })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.location.country}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: text }
                  })}
                />
              </View>

              <View style={styles.skillContainer}>
                <Text style={styles.sectionTitle}>Primary Skill *</Text>
                
                <Text style={styles.fieldLabel}>Instrument/Role</Text>
                <CustomPicker
                  selectedValue={formData.skills[0].name}
                  onValueChange={(value) => updateSkill(0, 'name', value)}
                  options={[
                    { label: 'Select your primary skill...', value: '' },
                    ...SKILL_OPTIONS.map(skill => ({ label: skill, value: skill }))
                  ]}
                  placeholder="Select your primary skill..."
                />
                
                <Text style={styles.fieldLabel}>Experience Level</Text>
                <CustomPicker
                  selectedValue={formData.skills[0].level}
                  onValueChange={(value) => updateSkill(0, 'level', value)}
                  options={[
                    { label: 'Select your level...', value: '' },
                    { label: 'Beginner', value: 'Beginner' },
                    { label: 'Intermediate', value: 'Intermediate' },
                    { label: 'Advanced', value: 'Advanced' },
                    { label: 'Professional', value: 'Professional' },
                  ]}
                  placeholder="Select your level..."
                />
              </View>

              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Tell us about yourself..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                multiline
                numberOfLines={4}
              />

              <View style={styles.musicLinksContainer}>
                <Text style={styles.sectionTitle}>🎵 Music Links (Optional)</Text>
                <Text style={styles.sectionSubtitle}>Share your music so others can hear your work!</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Spotify Track/Playlist URL"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.musicLinks.spotifyTrack}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    musicLinks: { ...formData.musicLinks, spotifyTrack: text }
                  })}
                  autoCapitalize="none"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="SoundCloud Track URL"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.musicLinks.soundcloudTrack}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    musicLinks: { ...formData.musicLinks, soundcloudTrack: text }
                  })}
                  autoCapitalize="none"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="YouTube Video URL"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.musicLinks.youtubeVideo}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    musicLinks: { ...formData.musicLinks, youtubeVideo: text }
                  })}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ff9500' }]}
                onPress={() => {
                  console.log('🔥 TEST BUTTON CLICKED!');
                  Alert.alert('Test', 'Button click works!');
                }}
              >
                <Text style={styles.buttonText}>Test Button Click</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.linkText}>
                  Already have an account? Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
    marginTop: 5,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    gap: 10,
  },
  skillContainer: {
    gap: 10,
  },
  musicLinksContainer: {
    gap: 10,
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  picker: {
    color: 'white',
    height: 50,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
