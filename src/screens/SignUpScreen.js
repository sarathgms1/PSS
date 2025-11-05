

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import { useTheme } from '../theme/colors';
import { FormInput, PasswordInput, Button, Logo } from '../components';

function SignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    dateOfBirth: null,
    address: '',
    country: '',
    email: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useTheme();

  const countries = ['India', 'Thailand', 'Singapore', 'Malaysia', 'UAE'];

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/[a-z]/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/[A-Z]/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(value)) {
          error = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
          error = 'Password must contain at least one special character';
        } else if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(value)) {
          error = 'Password must be alphanumeric with special characters';
        }
        break;

      case 'fullName':
        if (!value.trim()) {
          error = 'Full Name is required';
        } else if (value.length < 2) {
          error = 'Full Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Full Name can only contain letters and spaces';
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          error = 'Date of Birth is required';
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to compare dates only
          const birthDate = new Date(value);
          birthDate.setHours(0, 0, 0, 0);
          
          // Check if date is in the future
          if (birthDate > today) {
            error = 'Date of Birth cannot be in the future';
          } else {
            // Calculate age more accurately
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            
            // Adjust age if birthday hasn't occurred this year
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
              age--;
            }
            
            if (age < 18) {
              error = 'You must be at least 18 years old';
            } else if (age > 120) {
              error = 'Please enter a valid date of birth';
            }
          }
        }
        break;

      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.length < 10) {
          error = 'Address must be at least 10 characters';
        }
        break;

      case 'country':
        if (!value) {
          error = 'Country is required';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phoneNumber':
        if (!value.trim()) {
          error = 'Phone Number is required';
        } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(value)) {
          error = 'Please enter a valid phone number';
        } else if (value.replace(/[^0-9]/g, '').length < 10) {
          error = 'Phone number must have at least 10 digits';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Validate immediately and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || '',
    }));
  };

  const handleBlur = (name) => {
    const value = formData[name];
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      // Format date to YYYY-MM-DD
      const formatDateForAPI = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Prepare request body matching API format
      const requestBody = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        dob: formatDateForAPI(formData.dateOfBirth),
        address: formData.address,
        country: formData.country,
        email: formData.email,
        phone: formData.phoneNumber,
      };

      // Make API call
      const response = await fetch(getApiUrl(API_ENDPOINTS.SIGNUP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      setIsLoading(false);

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        // Handle API error response
        const errorMessage = data.message || data.error || 'Failed to create account. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Signup error:', error);
      Alert.alert(
        'Error',
        error.message === 'Network request failed'
          ? 'Unable to connect to server. Please check your connection.'
          : 'An error occurred. Please try again later.'
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type !== 'dismissed' && selectedDate) {
      handleFieldChange('dateOfBirth', selectedDate);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };


  const isFormValid = () => {
    let allValid = true;

    Object.keys(formData).forEach(key => {
      const value = formData[key];
      const error = validateField(key, value);
      
      // Check if field has a value
      let hasValue = false;
      if (key === 'dateOfBirth') {
        // For date, check if it's a valid Date object
        hasValue = value !== null && value !== undefined && value instanceof Date && !isNaN(value.getTime());
      } else {
        // For other fields, check if it's not empty
        const stringValue = String(value || '').trim();
        hasValue = stringValue !== '' && stringValue !== 'null' && stringValue !== 'undefined';
      }
      
      const isValid = !error && hasValue;
      
      if (!isValid) {
        allValid = false;
      }
    });
    
    return allValid;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingLeft: safeAreaInsets.left + 20,
            paddingRight: safeAreaInsets.right + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Logo />

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Fill in your details to get started
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Username */}
          <FormInput
            label="Username"
            value={formData.username}
            onChangeText={(value) => handleFieldChange('username', value)}
            onBlur={() => handleBlur('username')}
            placeholder="Enter username"
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            required
            colors={colors}
          />

          {/* Password */}
          <PasswordInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => handleFieldChange('password', value)}
            onBlur={() => handleBlur('password')}
            placeholder="Enter password"
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            editable={!isLoading}
            required
            hint="Must be 8+ characters with uppercase, number, and special character"
            colors={colors}
          />

          {/* Full Name */}
          <FormInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(value) => handleFieldChange('fullName', value)}
            onBlur={() => handleBlur('fullName')}
            placeholder="Enter full name"
            error={errors.fullName}
            autoCapitalize="words"
            editable={!isLoading}
            required
            colors={colors}
          />

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.dateInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.dateOfBirth ? colors.error : colors.border,
                },
              ]}
              onPress={() => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(true);
                } else {
                  setShowDatePicker(!showDatePicker);
                }
              }}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.dateText,
                  {
                    color: formData.dateOfBirth ? colors.text : colors.textSecondary,
                  },
                ]}
              >
                {formData.dateOfBirth ? formatDate(formData.dateOfBirth) : 'Select date of birth'}
              </Text>
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}
            {Platform.OS === 'ios' && showDatePicker && (
              <View style={styles.iosDatePickerContainer}>
                <View style={styles.iosDatePickerButtons}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.iosDatePickerButton}
                  >
                    <Text style={[styles.iosDatePickerButtonText, { color: colors.primary }]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={formData.dateOfBirth || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              </View>
            )}
            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>

          {/* Address */}
          <FormInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => handleFieldChange('address', value)}
            onBlur={() => handleBlur('address')}
            placeholder="Enter your address"
            error={errors.address}
            multiline
            numberOfLines={3}
            editable={!isLoading}
            required
            colors={colors}
          />

          {/* Country */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Country <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.countrySelector,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.country ? colors.error : colors.border,
                },
              ]}
              onPress={() => setShowCountryModal(true)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.countrySelectorText,
                  {
                    color: formData.country ? colors.text : colors.textSecondary,
                  },
                ]}
              >
                {formData.country || 'Select Country'}
              </Text>
              <Text style={[styles.dropdownArrow, { color: colors.text }]}>▼</Text>
            </TouchableOpacity>
            {errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}
          </View>

          {/* Country Selection Modal */}
          <Modal
            visible={showCountryModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCountryModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowCountryModal(false)}
            >
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: colors.inputBackground,
                  },
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Select Country
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCountryModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <Text style={[styles.modalCloseText, { color: colors.primary }]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScrollView}>
                  {countries.map((country) => (
                    <TouchableOpacity
                      key={country}
                      style={[
                        styles.countryOption,
                        {
                          backgroundColor:
                            formData.country === country
                              ? colors.primary
                              : 'transparent',
                          borderBottomColor: colors.border,
                        },
                      ]}
                      onPress={() => {
                        handleFieldChange('country', country);
                        setShowCountryModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.countryOptionText,
                          {
                            color:
                              formData.country === country
                                ? '#ffffff'
                                : colors.text,
                          },
                        ]}
                      >
                        {country}
                      </Text>
                      {formData.country === country && (
                        <Text style={[styles.checkmark, { color: '#ffffff' }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Email */}
          <FormInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleFieldChange('email', value)}
            onBlur={() => handleBlur('email')}
            placeholder="Enter email"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            required
            colors={colors}
          />

          {/* Phone Number */}
          <FormInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleFieldChange('phoneNumber', value)}
            onBlur={() => handleBlur('phoneNumber')}
            placeholder="Enter phone number"
            error={errors.phoneNumber}
            keyboardType="phone-pad"
            editable={!isLoading}
            required
            colors={colors}
          />

          {/* Submit Button */}
          <Button
            title="Create Account"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!isFormValid() || isLoading}
            variant={isFormValid() ? 'primary' : 'secondary'}
            colors={colors}
            style={styles.submitButton}
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 70,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
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
    paddingTop: 12,
    textAlignVertical: 'top',
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
  hintText: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  iosDatePickerContainer: {
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  iosDatePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iosDatePickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iosDatePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  countrySelector: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countrySelectorText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  countryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  countryOptionText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpScreen;

