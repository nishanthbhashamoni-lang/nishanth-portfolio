const TOKEN_KEY = 'nishanth_admin_jwt';

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Error saving auth token:', e);
  }
};

export const removeStoredToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error removing auth token:', e);
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData (e.g. file upload), remove Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      removeStoredToken();
    }

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

// API Client Methods
export const api = {
  // Public
  getProjects: async (categorySlug = '') => {
    const query = categorySlug && categorySlug !== 'all' ? `?category=${encodeURIComponent(categorySlug)}` : '';
    return apiRequest(`/api/projects${query}`);
  },

  getCategories: async (includeAll = false) => {
    const query = includeAll ? '?all=true' : '';
    return apiRequest(`/api/categories${query}`);
  },

  getResumeStatus: async () => {
    return apiRequest('/api/resume/status');
  },

  // Auth
  login: async (identifier, password) => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  getMe: async () => {
    return apiRequest('/api/auth/me');
  },

  logout: async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // Admin Projects / Work Operations
  createProject: async (projectData) => {
    return apiRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  updateProject: async (id, projectData) => {
    return apiRequest(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  },

  deleteProject: async (id) => {
    return apiRequest(`/api/projects/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Categories Operations
  createCategory: async (categoryData) => {
    return apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  updateCategory: async (id, categoryData) => {
    return apiRequest(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  },

  deleteCategory: async (id) => {
    return apiRequest(`/api/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Resume Operations
  uploadResume: async (pdfFile) => {
    const formData = new FormData();
    formData.append('resume', pdfFile);
    return apiRequest('/api/resume', {
      method: 'POST',
      body: formData
    });
  },

  deleteResume: async () => {
    return apiRequest('/api/resume', {
      method: 'DELETE'
    });
  },

  // File Uploads (Images & Document Attachments)
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/api/upload', {
      method: 'POST',
      body: formData
    });
  },

  deleteUploadedFile: async (fileUrl) => {
    return apiRequest('/api/upload', {
      method: 'DELETE',
      body: JSON.stringify({ url: fileUrl })
    });
  }
};