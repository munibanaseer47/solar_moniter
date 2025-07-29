export const generateMockInverterData = (currentData = {}) => {
  return {
    voltage: (Math.random() * 10 + 220).toFixed(2),
    current: (Math.random() * 5 + 10).toFixed(2),
    power: (Math.random() * 500 + 2000).toFixed(2),
    battery: Math.max(0, (currentData?.battery || 100) - 0.01).toFixed(2),
    status: Math.random() > 0.9 ? 'offline' : 'online',
    lastUpdated: new Date().toISOString(),
  };
};

export const generateMockLogs = (count = 30) => {
  const logs = {};
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const timestamp = now - (i * 3600000);
    const id = `log_${timestamp}`;
    logs[id] = {
      timestamp,
      voltage: (Math.random() * 10 + 220).toFixed(2),
      current: (Math.random() * 5 + 10).toFixed(2),
      power: (Math.random() * 500 + 2000).toFixed(2),
      battery: Math.max(0, 100 - (i * 0.5)).toFixed(2),
    };
  }
  
  return logs;
};

export const generateMockAlerts = () => {
  const now = Date.now();
  return {
    alert1: {
      id: 'alert1',
      type: 'battery',
      severity: 'high',
      message: 'Battery level critically low (10%)',
      timestamp: now - 3600000,
      resolved: false,
    },
    alert2: {
      id: 'alert2',
      type: 'connection',
      severity: 'medium',
      message: 'Inverter connection lost',
      timestamp: now - 7200000,
      resolved: true,
    },
    alert3: {
      id: 'alert3',
      type: 'voltage',
      severity: 'low',
      message: 'Voltage fluctuation detected',
      timestamp: now - 86400000,
      resolved: true,
    },
  };
};