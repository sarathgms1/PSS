
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import { useTheme } from '../theme/colors';
import { Button } from '../components';

function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const safeAreaInsets = useSafeAreaInsets();
  const colors = useTheme();

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Handle both array and object responses
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else if (data.data && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
      } else {
        const errorMessage = data.message || data.error || 'Failed to fetch users';
        Alert.alert('Error', errorMessage);
        setUsers([]);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      Alert.alert(
        'Error',
        error.message === 'Network request failed'
          ? 'Unable to connect to server. Please check your connection.'
          : 'An error occurred while fetching users.'
      );
      setUsers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    // Navigate back to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchUsers(true)}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome to Home
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {users.length > 0 ? `${users.length} user${users.length !== 1 ? 's' : ''} found` : 'You have successfully logged in!'}
          </Text>
        </View>

        {/* Loading State */}
        {isLoading && !isRefreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading users...
            </Text>
          </View>
        )}

        {/* Users List */}
        {!isLoading && users.length > 0 && (
          <View style={styles.usersContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Users List
            </Text>
            {users.map((user, index) => (
              <View
                key={user.id || user._id || index}
                style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.userHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {user.fullName || user.username || 'N/A'}
                  </Text>
                  {user.username && (
                    <Text style={[styles.userUsername, { color: colors.textSecondary }]}>
                      @{user.username}
                    </Text>
                  )}
                </View>
                
                <View style={styles.userDetails}>
                  {user.email && (
                    <View style={styles.userDetailRow}>
                      <Text style={[styles.userDetailLabel, { color: colors.textSecondary }]}>
                        Email:
                      </Text>
                      <Text style={[styles.userDetailValue, { color: colors.text }]}>
                        {user.email}
                      </Text>
                    </View>
                  )}
                  
                  {user.phone && (
                    <View style={styles.userDetailRow}>
                      <Text style={[styles.userDetailLabel, { color: colors.textSecondary }]}>
                        Phone:
                      </Text>
                      <Text style={[styles.userDetailValue, { color: colors.text }]}>
                        {user.phone}
                      </Text>
                    </View>
                  )}
                  
                  {user.dob && (
                    <View style={styles.userDetailRow}>
                      <Text style={[styles.userDetailLabel, { color: colors.textSecondary }]}>
                        DOB:
                      </Text>
                      <Text style={[styles.userDetailValue, { color: colors.text }]}>
                        {formatDate(user.dob)}
                      </Text>
                    </View>
                  )}
                  
                  {user.address && (
                    <View style={styles.userDetailRow}>
                      <Text style={[styles.userDetailLabel, { color: colors.textSecondary }]}>
                        Address:
                      </Text>
                      <Text style={[styles.userDetailValue, { color: colors.text }]}>
                        {user.address}
                      </Text>
                    </View>
                  )}
                  
                  {user.country && (
                    <View style={styles.userDetailRow}>
                      <Text style={[styles.userDetailLabel, { color: colors.textSecondary }]}>
                        Country:
                      </Text>
                      <Text style={[styles.userDetailValue, { color: colors.text }]}>
                        {user.country}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No users found
            </Text>
            <TouchableOpacity
              style={[styles.refreshButton, { borderColor: colors.primary }]}
              onPress={() => fetchUsers()}
              activeOpacity={0.8}
            >
              <Text style={[styles.refreshButtonText, { color: colors.primary }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          colors={colors}
          style={styles.logoutButton}
        />
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
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  cardContainer: {
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  usersContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  userHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 14,
  },
  userDetails: {
    gap: 8,
  },
  userDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  userDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
  },
  userDetailValue: {
    fontSize: 14,
    flex: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;

