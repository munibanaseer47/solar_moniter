import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import icons from '../constants/icons';

const Header = ({ title, onMenuPress, onBackPress, rightIcon, onRightPress }) => {
  return (
    <View style={styles.container}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
          <Text style={styles.icon}>{icons.back}</Text>
        </TouchableOpacity>
      ) : onMenuPress ? (
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Text style={styles.icon}>{icons.menu}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <Text style={styles.icon}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  iconPlaceholder: {
    width: 40,
  },
});

export default Header;