import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import colors from '../constants/colors';
import icons from '../constants/icons';

const AlertsScreen = () => {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock alerts data
  const mockAlerts = [
    {
      id: '1',
      type: 'battery',
      severity: 'high',
      message: 'Battery level critically low (15%)',
      timestamp: Date.now() - 3600000, // 1 hour ago
      resolved: false
    },
    {
      id: '2',
      type: 'connection',
      severity: 'medium',
      message: 'Inverter connection lost for 15 minutes',
      timestamp: Date.now() - 7200000, // 2 hours ago
      resolved: true
    },
    {
      id: '3',
      type: 'voltage',
      severity: 'low',
      message: 'Voltage fluctuation detected',
      timestamp: Date.now() - 86400000, // 1 day ago
      resolved: true
    },
    {
      id: '4',
      type: 'temperature',
      severity: 'high',
      message: 'Inverter temperature above threshold (65°C)',
      timestamp: Date.now() - 1800000, // 30 mins ago
      resolved: false
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.info;
      default: return colors.gray;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'battery': return icons.battery;
      case 'connection': return icons.connectivity;
      case 'voltage': return icons.power;
      case 'temperature': return '🌡️';
      default: return icons.alert;
    }
  };

  const markAsResolved = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? {...alert, resolved: true} : alert
    ));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recent Alerts</Text>
      
      {alerts.filter(alert => !alert.resolved).map(alert => (
        <Card key={alert.id} style={[styles.alertCard, {borderLeftColor: getAlertColor(alert.severity)}]}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
            <Text style={styles.alertMessage}>{alert.message}</Text>
          </View>
          <Text style={styles.alertTime}>
            {new Date(alert.timestamp).toLocaleString()}
          </Text>
          <TouchableOpacity 
            style={styles.resolveButton}
            onPress={() => markAsResolved(alert.id)}
          >
            <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
          </TouchableOpacity>
        </Card>
      ))}
      
      <Text style={styles.sectionTitle}>Resolved Alerts</Text>
      
      {alerts.filter(alert => alert.resolved).map(alert => (
        <Card key={alert.id} style={[styles.alertCard, styles.resolvedCard]}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
            <Text style={styles.alertMessage}>{alert.message}</Text>
          </View>
          <Text style={styles.alertTime}>
            {new Date(alert.timestamp).toLocaleString()}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: colors.textPrimary,
  },
  alertCard: {
    marginBottom: 12,
    borderLeftWidth: 5,
    padding: 12,
  },
  resolvedCard: {
    opacity: 0.7,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  alertMessage: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resolveButton: {
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    alignItems: 'center',
  },
  resolveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default AlertsScreen;