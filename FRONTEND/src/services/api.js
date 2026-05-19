import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default API;

const TOKEN_KEY = "admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Request interceptor for auth
API.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    const isServerDown = !res || res.status === 503 || res.status === 502 || res.status === 500;
    const hint = isServerDown
      ? " Backend API is unreachable. Ensure Render backend is running."
      : "";
    
    const msg = (res?.data?.error || res?.data?.message) || error.message || "Request failed";
    console.error(`API Error [${res?.status}]:`, msg, hint);
    
    return Promise.reject(new Error(msg + hint));
  }
);

// Helper for mapping ID (ensuring item.id is used)
const mapId = (item) => ({
  ...item,
  id: item.id || item._id,
});

// --- PUBLIC APIs ---

export async function fetchProjects() {
  try {
    const res = await API.get("/projects");
    const data = res.data;
    const projects = data && data.projects ? data.projects : [];
    return projects.map(mapId);
  } catch (error) {
    return [];
  }
}

export async function fetchSkillsPublic() {
  try {
    const res = await API.get("/skills");
    return Array.isArray(res.data) ? res.data.map(mapId) : [];
  } catch (error) {
    return [];
  }
}

export async function fetchHomePublic() {
  try {
    const res = await API.get("/home");
    return res.data && res.data.item ? mapId(res.data.item) : null;
  } catch (error) {
    return null;
  }
}

export async function fetchAboutPublic() {
  try {
    const res = await API.get("/about");
    return res.data && res.data.item ? mapId(res.data.item) : null;
  } catch (error) {
    return null;
  }
}

export async function fetchExperiencePublic() {
  try {
    const res = await API.get("/experience");
    return Array.isArray(res.data) ? res.data.map(mapId) : [];
  } catch (error) {
    return [];
  }
}

export async function fetchAchievementsPublic() {
  try {
    const res = await API.get("/achievements");
    return Array.isArray(res.data) ? res.data.map(mapId) : [];
  } catch (error) {
    return [];
  }
}

export async function fetchContentCreatorPublic() {
  try {
    const res = await API.get("/content-creator");
    return res.data ? mapId(res.data) : null;
  } catch (error) {
    return null;
  }
}

export async function fetchSiteSettings() {
  try {
    const res = await API.get("/site-settings");
    return res.data ? mapId(res.data) : {};
  } catch (error) {
    return {};
  }
}

export async function fetchContactSettingsPublic() {
  try {
    const res = await API.get("/contact-settings");
    return res.data ? mapId(res.data) : {};
  } catch (error) {
    return {};
  }
}

export async function submitContact(payload) {
  const res = await API.post("/contact", payload);
  return res.data;
}

export async function sendContact(payload) {
  return submitContact(payload);
}

// --- ADMIN APIs ---

export async function adminLogin(username, password) {
  const res = await API.post("/admin/login", { username, password });
  const data = res.data;
  if (data && data.token) setAdminToken(data.token);
  return data;
}

export async function adminUploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Admin Home
export async function fetchAdminHome() {
  const res = await API.get("/admin/home");
  return res.data;
}
export async function createAdminHome(payload) {
  const res = await API.post("/admin/home", payload);
  return res.data;
}
export async function updateAdminHome(id, payload) {
  const res = await API.put(`/admin/home/${id}`, payload);
  return res.data;
}
export async function deleteAdminHome(id) {
  const res = await API.delete(`/admin/home/${id}`);
  return res.data;
}

// Admin About
export async function fetchAdminAbout() {
  const res = await API.get("/admin/about");
  return res.data;
}
export async function createAdminAbout(payload) {
  const res = await API.post("/admin/about", payload);
  return res.data;
}
export async function updateAdminAbout(id, payload) {
  const res = await API.put(`/admin/about/${id}`, payload);
  return res.data;
}
export async function deleteAdminAbout(id) {
  const res = await API.delete(`/admin/about/${id}`);
  return res.data;
}

// Admin Skills
export async function fetchAdminSkills() {
  const res = await API.get("/admin/skills");
  return res.data;
}
export async function createAdminSkill(payload) {
  const res = await API.post("/admin/skills", payload);
  return res.data;
}
export async function updateAdminSkill(id, payload) {
  const res = await API.put(`/admin/skills/${id}`, payload);
  return res.data;
}
export async function deleteAdminSkill(id) {
  const res = await API.delete(`/admin/skills/${id}`);
  return res.data;
}

// Admin Projects
export async function fetchAdminProjects() {
  const res = await API.get("/admin/projects");
  return res.data;
}
export async function createAdminProject(payload) {
  const res = await API.post("/admin/projects", payload);
  return res.data;
}
export async function updateAdminProject(id, payload) {
  const res = await API.put(`/admin/projects/${id}`, payload);
  return res.data;
}
export async function deleteAdminProject(id) {
  const res = await API.delete(`/admin/projects/${id}`);
  return res.data;
}

// Admin Experience
export async function fetchAdminExperience() {
  const res = await API.get("/admin/experience");
  return res.data;
}
export async function createAdminExperience(payload) {
  const res = await API.post("/admin/experience", payload);
  return res.data;
}
export async function updateAdminExperience(id, payload) {
  const res = await API.put(`/admin/experience/${id}`, payload);
  return res.data;
}
export async function deleteAdminExperience(id) {
  const res = await API.delete(`/admin/experience/${id}`);
  return res.data;
}

// Admin Achievements (Blog)
export async function fetchAdminAchievements() {
  const res = await API.get("/admin/achievements");
  return res.data;
}
export async function createAdminAchievement(payload) {
  const res = await API.post("/admin/achievements", payload);
  return res.data;
}
export async function updateAdminAchievement(id, payload) {
  const res = await API.put(`/admin/achievements/${id}`, payload);
  return res.data;
}
export async function deleteAdminAchievement(id) {
  const res = await API.delete(`/admin/achievements/${id}`);
  return res.data;
}

// Admin Messages
export async function fetchAdminMessages() {
  const res = await API.get("/admin/messages");
  return res.data;
}
export async function deleteAdminMessage(id) {
  const res = await API.delete(`/admin/message/${id}`);
  return res.data;
}

// Admin Content Creator
export async function fetchAdminContentCreator() {
  const res = await API.get("/admin/content-creator");
  return res.data;
}
export async function saveAdminContentCreator(payload) {
  const res = await API.post("/admin/content-creator", payload);
  return res.data;
}

// Admin Settings
export async function fetchAdminSiteSettings() {
  const res = await API.get("/admin/site-settings");
  return res.data;
}
export async function saveAdminSiteSettings(payload) {
  const res = await API.post("/admin/site-settings", payload);
  return res.data;
}

export async function fetchAdminContactSettings() {
  const res = await API.get("/admin/contact-settings");
  return res.data;
}
export async function saveAdminContactSettings(payload) {
  const res = await API.post("/admin/contact-settings", payload);
  return res.data;
}
