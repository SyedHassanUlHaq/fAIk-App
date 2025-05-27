import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://127.0.0.1:8000';

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export interface ApiError {
  detail: string;
  code?: string;
  field?: string;
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorData = error.response.data as ApiError;
    
    if (errorData.detail) {
      return errorData.detail;
    }
    
    if (errorData.code === 'email_already_exists') {
      return 'This email is already registered. Please use a different email or login.';
    }
    
    if (errorData.code === 'invalid_password') {
      return 'Password must be at least 6 characters long and contain at least one number.';
    }
    
    if (errorData.field) {
      return `Invalid ${errorData.field}. Please check your input.`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Something happened in setting up the request that triggered an Error
  return 'An unexpected error occurred. Please try again later.';
}; 