import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Card from '../components/Card';
import StatusIndicator from '../components/StatusIndicator';
import database from '@react-native-firebase/database';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const [inverterData, setInverterData] = useState({
    voltage: 0,
    current: 0,
    power: 0,
    battery: 100,
    status: 'online',
  });
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState('');

  useEffect(() => {
    if (!user) return;

    // Reference to the user's inverter data in Firebase
    const inverterRef = database().ref(`/users/${user.uid}/inverter`);

    // Set up listener for realtime updates
    const subscriber = inverterRef.on('value', (snapshot) => {
      const data = snapshot.val() || generateMockData();
      setInverterData(data);
    });

    // Generate initial mock data if none exists
    if (!inverterRef.once('value').then(snapshot => snapshot.exists())) {
      inverterRef.set(generateMockData());
    }

    // Update data every second
    const interval = setInterval(() => {
      const newData = generateMockData();
      inverterRef.set(newData);
    }, 1000);

    return () => {
      inverterRef.off('value', subscriber);
      clearInterval(interval);
    };
  }, [user]);

  const generateMockData = () => {
    return {
      voltage: (Math.random() * 10 + 220).toFixed(2),
      current: (Math.random() * 5 + 10).toFixed(2),
      power: (Math.random() * 500 + 2000).toFixed(2),
      battery: Math.max(0, (inverterData?.battery || 100) - 0.01).toFixed(2),
      status: Math.random() > 0.9 ? 'offline' : 'online',
      lastUpdated: new Date().toISOString(),
    };
  };

  const handleAddDevice = (method) => {
    setConnectionMethod(method);
    setShowAddDevice(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solar Inverter Monitor</Text>
      
      <Card>
        <Text style={styles.cardTitle}>Current Status</Text>
        <StatusIndicator status={inverterData.status} />
        
        <View style={styles.dataRow}>
          <Text>⚡ Voltage:</Text>
          <Text>{inverterData.voltage} V</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text>🔌 Current:</Text>
          <Text>{inverterData.current} A</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text>📶 Power:</Text>
          <Text>{inverterData.power} W</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text>🔋 Battery:</Text>
          <Text>{inverterData.battery}%</Text>
        </View>
      </Card>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => handleAddDevice('bluetooth')}>
        <Text>➕ Add Device via Bluetooth</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => handleAddDevice('manual')}>
        <Text>➕ Add Device Manually</Text>
      </TouchableOpacity>

      {showAddDevice && (
        <Card>
          <Text style={styles.cardTitle}>
            Add Device {connectionMethod === 'bluetooth' ? 'via Bluetooth' : 'Manually'}
          </Text>
          
          {connectionMethod === 'bluetooth' ? (
            <Text>Searching for Bluetooth devices. Currently not configured might enable in future... (mock UI)</Text>
          ) : (
            <>
              <Text>IP Address:</Text>
              <TextInput style={styles.input} placeholder="192.168.1.100" />
              <Text>Username:</Text>
              <TextInput style={styles.input} placeholder="admin" />
              <Text>Password:</Text>
              <TextInput style={styles.input} placeholder="password" secureTextEntry />
              <TouchableOpacity style={styles.submitButton}>
                <Text>Connect</Text>
              </TouchableOpacity>
            </>
          )}
        </Card>
      )}
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
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default HomeScreen;