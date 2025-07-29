import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import HomeScreen from '../screens/Home';
import LogsScreen from '../screens/Logs';
import AlertsScreen from '../screens/Alerts';
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabIcon = (route, focused) => {
  let icon;
  switch (route.name) {
    case 'Home':
      icon = '⚡';
      break;
    case 'Logs':
      icon = '📊';
      break;
    case 'Alerts':
      icon = '⚠️';
      break;
    case 'Settings':
      icon = '⚙️';
      break;
    default:
      icon = '⚡';
  }
  return <Text style={{ fontSize: 24 }}>{icon}</Text>;
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabIcon(route, focused),
        tabBarLabel: ({ focused, color }) => {
          return <Text style={{ color, fontSize: 12 }}>{route.name}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;