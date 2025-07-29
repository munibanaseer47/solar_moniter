import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../components/Card';
import Chart from '../components/Chart';
import database from '@react-native-firebase/database';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

const LogsScreen = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('day');

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const snapshot = await database()
          .ref(`/users/${user.uid}/logs`)
          .orderByChild('timestamp')
          .limitToLast(50)
          .once('value');
        
        const logsData = snapshot.val() || generateMockLogs();
        const logsArray = Object.keys(logsData).map(key => ({
          id: key,
          ...logsData[key],
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        setLogs(logsArray);
        
        // If no logs exist, generate some mock data
        if (logsArray.length === 0) {
          const mockLogs = generateMockLogs();
          await database().ref(`/users/${user.uid}/logs`).set(mockLogs);
          setLogs(Object.keys(mockLogs).map(key => ({
            id: key,
            ...mockLogs[key],
          })));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user, timeRange]);

  const generateMockLogs = () => {
    const mockLogs = {};
    const now = Date.now();
    
    for (let i = 0; i < 30; i++) {
      const timestamp = now - (i * 3600000);
      const id = `log_${timestamp}`;
      mockLogs[id] = {
        timestamp,
        voltage: (Math.random() * 10 + 220).toFixed(2),
        current: (Math.random() * 5 + 10).toFixed(2),
        power: (Math.random() * 500 + 2000).toFixed(2),
        battery: Math.max(0, 100 - (i * 0.5)).toFixed(2),
      };
    }
    
    return mockLogs;
  };

  const handleRefresh = async () => {
    const newLogs = generateMockLogs();
    await database().ref(`/users/${user.uid}/logs`).set(newLogs);
    setLogs(Object.keys(newLogs).map(key => ({
      id: key,
      ...newLogs[key],
    })));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Inverter Logs</Text>
      
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity 
          style={[styles.timeButton, timeRange === 'day' && styles.activeTimeButton]}
          onPress={() => setTimeRange('day')}>
          <Text>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeButton, timeRange === 'week' && styles.activeTimeButton]}
          onPress={() => setTimeRange('week')}>
          <Text>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeButton, timeRange === 'month' && styles.activeTimeButton]}
          onPress={() => setTimeRange('month')}>
          <Text>Month</Text>
        </TouchableOpacity>
      </View>
      
      <Card>
        <Chart data={logs.map(log => ({
          x: moment(log.timestamp).format('HH:mm'),
          y: parseFloat(log.power),
        }))} />
      </Card>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={loading}>
        <Text>{loading ? 'Loading...' : '🔄 Refresh Data'}</Text>
      </TouchableOpacity>
      
      <Card>
        <Text style={styles.cardTitle}>Recent Readings</Text>
        {logs.slice(0, 10).map(log => (
          <View key={log.id} style={styles.logItem}>
            <Text>{moment(log.timestamp).format('MMM D, HH:mm')}</Text>
            <View style={styles.logData}>
              <Text>{log.power} W</Text>
              <Text>{log.battery}%</Text>
            </View>
          </View>
        ))}
      </Card>
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
  timeRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  timeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeTimeButton: {
    backgroundColor: '#4CAF50',
  },
  refreshButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logData: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
  },
});

export default LogsScreen;