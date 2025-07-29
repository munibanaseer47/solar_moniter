import database from '@react-native-firebase/database';

export const getUserRef = (userId) => {
  return database().ref(`/users/${userId}`);
};

export const getInverterRef = (userId) => {
  return database().ref(`/users/${userId}/inverter`);
};

export const getAlertsRef = (userId) => {
  return database().ref(`/users/${userId}/alerts`);
};

export const getLogsRef = (userId) => {
  return database().ref(`/users/${userId}/logs`);
};

export const updateUserProfile = async (userId, data) => {
  try {
    await getUserRef(userId).update(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update profile' };
  }
};

export const addAlert = async (userId, alertData) => {
  try {
    const newAlertRef = getAlertsRef(userId).push();
    await newAlertRef.set({
      ...alertData,
      timestamp: database.ServerValue.TIMESTAMP,
    });
    return { success: true, id: newAlertRef.key };
  } catch (error) {
    return { success: false, error: 'Failed to add alert' };
  }
};

export const markAlertAsResolved = async (userId, alertId) => {
  try {
    await getAlertsRef(userId).child(alertId).update({ resolved: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update alert' };
  }
};