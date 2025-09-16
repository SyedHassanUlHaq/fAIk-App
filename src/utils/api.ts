import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple token management for mock authentication
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

// ----- Mock/Dummy API for Dashboard -----
export type DashboardData = {
  name: string;
  totalVideos: number;
  aiGeneratedPercent: number; // 0-100
  accuracyPercent: number; // 0-100
  deletedVideos: number;
  recentFiles: string[];
};

export const fetchDashboardMock = async (userId?: string): Promise<DashboardData> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Return deterministic but realistic dummy data
  return {
    name: 'Emma Phillips',
    totalVideos: 1426,
    aiGeneratedPercent: 15.6,
    accuracyPercent: 67.3,
    deletedVideos: 256,
    recentFiles: [
      'Video 1.mp4',
      'Zoom Meeting.mov',
      'Google meet.mp4',
      'Video 2.mp4',
      'Meeting.mov',
      'Google meet.mp4',
      'Google meet.mp4',
      'Video 2.mp4',
      'Meeting.mov',
      'Google meet.mp4',
      'Google meet.mp4',
      'Video 2.mp4',
      'Meeting.mov',
      'Google meet.mp4',
    ],
  };
};

// ----- Mock Upload/Process/Report API -----
export type UploadResponse = { uploadId: string; fileName: string };
export type ProcessResponse = { jobId: string; status: 'queued' | 'processing' | 'completed' };
export type ReportResponse = { url: string };

export const mockUploadFile = async (uri: string, name: string): Promise<UploadResponse> => {
  await new Promise((r) => setTimeout(r, 800));
  // Return a fake ID
  return { uploadId: `upl_${Math.random().toString(36).slice(2, 10)}`, fileName: name };
};

export const mockStartProcessing = async (uploadId: string): Promise<ProcessResponse> => {
  await new Promise((r) => setTimeout(r, 400));
  return { jobId: `job_${uploadId}`, status: 'queued' };
};

export const mockFetchReport = async (jobId: string): Promise<ReportResponse> => {
  await new Promise((r) => setTimeout(r, 500));
  return { url: `https://example.com/report/${jobId}` };
};
