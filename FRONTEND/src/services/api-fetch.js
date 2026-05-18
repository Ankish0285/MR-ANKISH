/**
 * Fetch API Service Module
 * 
 * This is an alternative to the Axios API service that uses the native Fetch API.
 * Use this if you want to avoid the axios dependency.
 * 
 * Features:
 * - Request/response interceptors
 * - Automatic token injection for admin endpoints
 * - Error handling with server status detection
 * - Support for form data and multipart uploads
 * 
 * Usage:
 * Replace api.js imports with this file or use alongside axios API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'admin_token';

// Storage helper functions
export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Response handler
async function handleResponse(response) {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let error;

    if (contentType?.includes('application/json')) {
      const data = await response.json();
      error = new Error(data.error || data.message || response.statusText);
      error.status = response.status;
      error.data = data;
    } else {
      error = new Error(response.statusText || 'Request failed');
      error.status = response.status;
    }

    // Check if server is down
    if (!response.ok && (response.status === 503 || response.status === 502 || response.status === 500)) {
      error.message += ' [Backend unreachable - ensure Render backend is running]';
    }

    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

// Fetch wrapper with interceptors
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    ...options.headers,
  };

  // Add authorization header if token exists
  const token = getAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for CORS requests
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`[Fetch Error] ${error.message}`);
    throw error;
  }
}

// GET request
export async function GET(endpoint) {
  return fetchAPI(endpoint, {
    method: 'GET',
  });
}

// POST request
export async function POST(endpoint, data = null) {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

// PUT request
export async function PUT(endpoint, data = null) {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

// PATCH request
export async function PATCH(endpoint, data = null) {
  return fetchAPI(endpoint, {
    method: 'PATCH',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

// DELETE request
export async function DELETE(endpoint) {
  return fetchAPI(endpoint, {
    method: 'DELETE',
  });
}

// PUBLIC ENDPOINTS

export async function fetchProjects() {
  try {
    const data = await GET('/projects');
    return data?.projects || [];
  } catch (error) {
    return [];
  }
}

export async function fetchSkillsPublic() {
  try {
    const data = await GET('/skills');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function fetchHomePublic() {
  try {
    const data = await GET('/home');
    return data?.item || null;
  } catch (error) {
    return null;
  }
}

export async function fetchAboutPublic() {
  try {
    const data = await GET('/about');
    return data?.item || null;
  } catch (error) {
    return null;
  }
}

export async function fetchExperiencePublic() {
  try {
    const data = await GET('/experience');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function fetchAchievementsPublic() {
  try {
    const data = await GET('/achievements');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function fetchContentCreatorPublic() {
  try {
    const data = await GET('/content-creator');
    return data || null;
  } catch (error) {
    return null;
  }
}

export async function fetchSiteSettings() {
  try {
    const data = await GET('/site-settings');
    return data || {};
  } catch (error) {
    return {};
  }
}

export async function fetchContactSettingsPublic() {
  return fetchSiteSettings();
}

export async function submitContact(payload) {
  return POST('/contact', payload);
}

export async function sendContact(payload) {
  return submitContact(payload);
}

// ADMIN ENDPOINTS

export async function adminLogin(username, password) {
  const data = await POST('/admin/login', { username, password });
  if (data?.token) {
    setAdminToken(data.token);
  }
  return data;
}

export async function adminUploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  return POST('/admin/upload', formData);
}

// Admin Home
export async function fetchAdminHome() {
  return GET('/admin/home');
}

export async function createAdminHome(payload) {
  return POST('/admin/home', payload);
}

export async function updateAdminHome(id, payload) {
  return PUT(`/admin/home/${id}`, payload);
}

export async function deleteAdminHome(id) {
  return DELETE(`/admin/home/${id}`);
}

// Admin About
export async function fetchAdminAbout() {
  return GET('/admin/about');
}

export async function createAdminAbout(payload) {
  return POST('/admin/about', payload);
}

export async function updateAdminAbout(id, payload) {
  return PUT(`/admin/about/${id}`, payload);
}

export async function deleteAdminAbout(id) {
  return DELETE(`/admin/about/${id}`);
}

// Admin Skills
export async function fetchAdminSkills() {
  return GET('/admin/skills');
}

export async function createAdminSkill(payload) {
  return POST('/admin/skills', payload);
}

export async function updateAdminSkill(id, payload) {
  return PUT(`/admin/skills/${id}`, payload);
}

export async function deleteAdminSkill(id) {
  return DELETE(`/admin/skills/${id}`);
}

// Admin Projects
export async function fetchAdminProjects() {
  return GET('/admin/projects');
}

export async function createAdminProject(payload) {
  return POST('/admin/projects', payload);
}

export async function updateAdminProject(id, payload) {
  return PUT(`/admin/projects/${id}`, payload);
}

export async function deleteAdminProject(id) {
  return DELETE(`/admin/projects/${id}`);
}

// Admin Experience
export async function fetchAdminExperience() {
  return GET('/admin/experience');
}

export async function createAdminExperience(payload) {
  return POST('/admin/experience', payload);
}

export async function updateAdminExperience(id, payload) {
  return PUT(`/admin/experience/${id}`, payload);
}

export async function deleteAdminExperience(id) {
  return DELETE(`/admin/experience/${id}`);
}

// Admin Achievements (Blog)
export async function fetchAdminAchievements() {
  return GET('/admin/achievements');
}

export async function createAdminAchievement(payload) {
  return POST('/admin/achievements', payload);
}

export async function updateAdminAchievement(id, payload) {
  return PUT(`/admin/achievements/${id}`, payload);
}

export async function deleteAdminAchievement(id) {
  return DELETE(`/admin/achievements/${id}`);
}

// Admin Messages
export async function fetchAdminMessages() {
  return GET('/admin/messages');
}

export async function deleteAdminMessage(id) {
  return DELETE(`/admin/message/${id}`);
}

// Admin Content Creator
export async function fetchAdminContentCreator() {
  return GET('/admin/content-creator');
}

export async function saveAdminContentCreator(payload) {
  return POST('/admin/content-creator', payload);
}

// Admin Settings
export async function fetchAdminSiteSettings() {
  return GET('/admin/site-settings');
}

export async function saveAdminSiteSettings(payload) {
  return POST('/admin/site-settings', payload);
}

export async function fetchAdminContactSettings() {
  return GET('/admin/contact-settings');
}

export async function saveAdminContactSettings(payload) {
  return POST('/admin/contact-settings', payload);
}
