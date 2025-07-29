import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusIndicator = ({ status }) => {
  const getStatusColor = () => {
    return status === 'online' ? '#4CAF50' : '#f44336';
  };

  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      <Text style={styles.statusText}>
        {status === 'online' ? 'Online' : 'Offline'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
  },
});

export default StatusIndicator;