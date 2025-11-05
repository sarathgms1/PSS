/**
 * FormInput Component
 * Reusable text input with label and error handling
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

function FormInput({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  required = false,
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
      <TextInput
        style={[
          multiline ? styles.textArea : styles.input,
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
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormInput;

