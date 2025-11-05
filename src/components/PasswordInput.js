/**
 * PasswordInput Component
 * Reusable password input with show/hide toggle
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function PasswordInput({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  showPassword,
  onTogglePassword,
  editable = true,
  required = false,
  hint,
  colors,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.passwordInput,
            {
              backgroundColor: colors.inputBackground,
              borderColor: error ? colors.error : colors.border,
              color: colors.text,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={onTogglePassword}
          disabled={!editable}
        >
          <Text style={[styles.eyeButtonText, { color: colors.primary }]}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && (
        <Text style={[styles.hintText, { color: colors.textSecondary }]}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 80,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default PasswordInput;

