
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import { useTheme } from '../theme/colors';
import { FormInput, PasswordInput, Button, Logo } from '../components';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useTheme();

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleFieldChange = (name, value) => {
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }

    // Validate immediately and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || '',
    }));
  };

  const handleBlur = (name) => {
    const value = name === 'email' ? email : password;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);

    if (emailError) {
      newErrors.email = emailError;
    }
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare request body
      const requestBody = {
        usernameOrEmail: email.trim(),
        password: password,
      };

      // Make API call
      const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      setIsLoading(false);

      if (response.ok) {
        // Clear any previous errors
        setErrors({});
        // Login successful - navigate to Home screen
        // You can also store the token/user data here if the API returns it
        // For example: AsyncStorage.setItem('token', data.token);
        navigation.replace('Home');
      } else {
        // Handle API error response and show inline errors
        const newErrors = {};
        
        // Check for field-specific errors
        if (data.errors) {
          // Handle validation errors object (e.g., { email: "Invalid email", password: "Invalid password" })
          if (data.errors.email) {
            newErrors.email = data.errors.email;
          }
          if (data.errors.password) {
            newErrors.password = data.errors.password;
          }
        }
        
        // Check for general error messages that might be field-specific
        const errorMessage = data.message || data.error || 'Login failed. Please check your credentials.';
        
        // Try to determine which field the error relates to
        if (errorMessage.toLowerCase().includes('email') && !newErrors.email) {
          newErrors.email = errorMessage;
        } else if (errorMessage.toLowerCase().includes('password') && !newErrors.password) {
          newErrors.password = errorMessage;
        } else if (errorMessage.toLowerCase().includes('credential') || errorMessage.toLowerCase().includes('invalid')) {
          // If it's a credentials error, show on both fields or just password
          newErrors.password = errorMessage;
          if (!newErrors.email) {
            newErrors.email = 'Invalid email or password';
          }
        } else if (Object.keys(newErrors).length === 0) {
          // If no field-specific error, show general error
          newErrors.password = errorMessage;
        }
        
        setErrors(newErrors);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error.message === 'Network request failed'
          ? 'Unable to connect to server. Please check your connection.'
          : 'An error occurred. Please try again later.'
      );
    }
  };


  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: safeAreaInsets.top + 20,
            paddingBottom: safeAreaInsets.bottom + 20,
            paddingLeft: safeAreaInsets.left + 20,
            paddingRight: safeAreaInsets.right + 20,
          },
        ]}
      >
        {/* Logo */}
        <Logo />

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <FormInput
            label="Email"
            value={email}
            onChangeText={(value) => handleFieldChange('email', value)}
            onBlur={() => handleBlur('email')}
            placeholder="Enter your email"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            colors={colors}
          />

          {/* Password Input */}
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={(value) => handleFieldChange('password', value)}
            onBlur={() => handleBlur('password')}
            placeholder="Enter your password"
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            editable={!isLoading}
            colors={colors}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            disabled={isLoading}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            colors={colors}
            style={styles.loginButton}
          />

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              disabled={isLoading}
            >
              <Text style={[styles.signUpLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;

