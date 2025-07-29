import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Card from '../components/Card';
import { AuthContext } from '../context/AuthContext';
import database from '@react-native-firebase/database';

const SettingsScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    ipAddress: '',
    syncEnabled: true,
  });
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const snapshot = await database().ref(`/users/${user.uid}`).once('value');
      const userData = snapshot.val() || {};
      setProfile({
        name: userData.name || '',
        email: user?.email || '',
        ipAddress: userData.ipAddress || '',
        syncEnabled: userData.syncEnabled !== false,
      });
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      await database().ref(`/users/${user.uid}`).update({
        name: profile.name,
        ipAddress: profile.ipAddress,
        syncEnabled: profile.syncEnabled,
      });
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <Card>
        <Text style={styles.cardTitle}>Profile</Text>
        
        {editMode ? (
          <>
            <Text>Name:</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({...profile, name: text})}
            />
            
            <Text>Email:</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              editable={false}
            />
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            
            {saved && <Text style={styles.successText}>Profile saved successfully!</Text>}
          </>
        ) : (
          <>
            <View style={styles.profileRow}>
              <Text>👤 Name:</Text>
              <Text>{profile.name || 'Not set'}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Text>📧 Email:</Text>
              <Text>{profile.email}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditMode(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </Card>
      
      <Card>
        <Text style={styles.cardTitle}>Inverter Settings</Text>
        
        <Text>IP Address:</Text>
        <TextInput
          style={styles.input}
          value={profile.ipAddress}
          onChangeText={(text) => setProfile({...profile, ipAddress: text})}
          placeholder="192.168.1.100"
        />
        
        <View style={styles.toggleRow}>
          <Text>Enable Sync:</Text>
          <TouchableOpacity
            style={[styles.toggleButton, profile.syncEnabled && styles.toggleButtonActive]}
            onPress={() => setProfile({...profile, syncEnabled: !profile.syncEnabled})}>
            <Text>{profile.syncEnabled ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>
      </Card>
      
      <Card>
        <Text style={styles.cardTitle}>About</Text>
        <Text>Solar Inverter Monitor v1.0</Text>
        <Text>Developed with React Native</Text>
        <Text>Developed by Rimsha Zulfiqar</Text>
      </Card>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={logout}>
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleButton: {
    padding: 8,
    width: 60,
    borderRadius: 15,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SettingsScreen;