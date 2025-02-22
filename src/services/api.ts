import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Define interfaces to match backend types
interface GifResponse {
  gifPath: string;
  transcriptPath: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadVideo = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<GifResponse> => {
  // Validate file type
  const allowedFormats = [
    "video/mp4",
    "video/x-m4v",
    "video/quicktime",
    "video/mov",
    "video/x-matroska"
  ];

  if (!allowedFormats.includes(file.type.toLowerCase())) {
    throw new Error(`Invalid file type. Allowed formats: ${allowedFormats.join(', ')}`);
  }

  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await api.post<GifResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        );
        onProgress?.(percentCompleted);
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getGifUrl = (gifPath: string) => {
  return `${API_BASE_URL}/gifs/${gifPath}`;
};

export default api;