/**
 * Logo Component
 * Reusable logo component
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

function Logo({ style, logoStyle }) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/logo.jpg')}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 80,
  },
});

export default Logo;

