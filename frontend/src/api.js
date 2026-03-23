const API_BASE = '/api';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token'); // In a real app we'd use better auth, but this is a lab
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }
  return data;
};

export const api = {
  login: (credentials) => request('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (credentials) => request('/auth/register/', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me/'),
  getPosts: () => request('/posts/'),
  createPost: (content) => request('/posts/', { method: 'POST', body: JSON.stringify({ content }) }),
  getPost: (id) => request(`/posts/${id}/`),
  createComment: (postId, content) => request(`/posts/${postId}/comments/`, { method: 'POST', body: JSON.stringify({ content }) }),
  search: (query) => request(`/search/?q=${encodeURIComponent(query)}`)
};
