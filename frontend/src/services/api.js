import axios from 'axios';

const API_BASE_URL = 'https://speakeasy-backend-0rkm.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: injects JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handles 401 unauthorized & 403 forbidden
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Endpoints
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const practiceApi = {
  submitSentence: (data) => api.post('/practice', data),
  recordCheckin: (data) => api.post('/checkins', data),
};

export const sessionApi = {
  getSessions: (page = 0, size = 10, sort = 'createdAt', direction = 'desc') =>
    api.get(`/sessions?page=${page}&size=${size}&sort=${sort}&direction=${direction}`),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
};

export const progressApi = {
  getProgress: () => api.get('/progress'),
};

export const drillApi = {
  getDueDrills: () => api.get('/drills/due'),
  answerDrill: (id, isCorrect) => api.put(`/drills/${id}/answer`, { isCorrect }),
  generateDrills: () => api.post('/drills/generate'),
};

export const interviewApi = {
  getQuestion: (role, category) => api.get(`/interview/question?role=${role || ''}&category=${category || ''}`),
  submitAttempt: (data) => api.post('/interview/attempts', data),
};

export const classApi = {
  getClasses: () => api.get('/classes'),
  createClass: (name) => api.post('/classes', { name }),
  joinClass: (joinCode) => api.post('/classes/join', { joinCode }),
  getClassStats: (id) => api.get(`/classes/${id}/stats`),
};

export const adminApi = {
  getQuestions: (page = 0, size = 10, search = '') =>
    api.get(`/admin/questions?page=${page}&size=${size}&search=${search}`),
  createQuestion: (data) => api.post('/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
  getXpWeights: () => api.get('/admin/xp-weights'),
  updateXpWeights: (data) => api.put('/admin/xp-weights', data),
};

export const aiApi = {
  getCoachPrompt: (fearScore, currentRole, levelTitle) =>
    api.post('/ai/coach', { fearScore, currentRole, levelTitle }),
  getHesitationReport: () => api.get('/ai/hesitation-report'),
  getWeeklyStory: () => api.get('/ai/weekly-story'),
  sayItInMyWords: (sentence, tone, level) =>
    api.post('/ai/say-it-in-my-words', { sentence, tone, level }),
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export default api;
