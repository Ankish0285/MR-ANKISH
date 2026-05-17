// Normalizing casing to frontend tree
// Production: Use deployed backend URL from env, Dev: Use relative path with local proxy
/** @type {any} */
const meta = import.meta;
const API_BASE = meta.env?.VITE_API_URL || "";

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

async function parseJson(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    const isServerDown = res.status === 503 || res.status === 502 || res.status === 500;
    const hint = isServerDown
      ? " Backend API is unreachable or crashed. Ensure Render backend is active."
      : "";
    console.error(`Non-JSON response from ${res.url}:`, text);
    throw new Error(
      text?.trim()
        ? `Server error (${res.status}): ${text.substring(0, 100)}${hint}`
        : `Empty or bad response (${res.status}).${hint}`
    );
  }
  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) || res.statusText || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function authHeaders(json = true) {
  const token = getAdminToken();
  /** @type {Record<string, string>} */
  const h = {};
  if (json) h["Content-Type"] = "application/json";
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// --- PUBLIC APIs ---

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    const data = await parseJson(res);
    return data && data.projects ? data.projects : [];
  } catch (error) {
    console.error("fetchProjects error:", error);
    return [];
  }
}

export async function fetchSkillsPublic() {
  try {
    const res = await fetch(`${API_BASE}/api/skills`);
    const data = await parseJson(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("fetchSkillsPublic error:", error);
    return [];
  }
}

export async function fetchHomePublic() {
  try {
    const res = await fetch(`${API_BASE}/api/home`);
    const data = await parseJson(res);
    return data && data.item ? data.item : null;
  } catch (error) {
    console.error("fetchHomePublic error:", error);
    return null;
  }
}

export async function fetchAboutPublic() {
  try {
    const res = await fetch(`${API_BASE}/api/about`);
    const data = await parseJson(res);
    return data && data.item ? data.item : null;
  } catch (error) {
    console.error("fetchAboutPublic error:", error);
    return null;
  }
}

export async function fetchExperiencePublic() {
  try {
    const res = await fetch(`${API_BASE}/api/experience`);
    const data = await parseJson(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("fetchExperiencePublic error:", error);
    return [];
  }
}

export async function fetchAchievementsPublic() {
  try {
    const res = await fetch(`${API_BASE}/api/achievements`);
    const data = await parseJson(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("fetchAchievementsPublic error:", error);
    return [];
  }
}

export async function fetchContentCreatorPublic() {
  try {
    const res = await fetch(`${API_BASE}/api/content-creator`);
    const data = await parseJson(res);
    return data || null;
  } catch (error) {
    console.error("fetchContentCreatorPublic error:", error);
    return null;
  }
}

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${API_BASE}/api/site-settings`);
    const data = await parseJson(res);
    return data || {};
  } catch (error) {
    console.error("fetchSiteSettings error:", error);
    return {};
  }
}

export async function fetchContactSettingsPublic() {
  return fetchSiteSettings();
}

export async function submitContact(payload) {
  console.log("Submitting contact form to:", `${API_BASE}/api/contact`);
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function sendContact(payload) {
  return submitContact(payload);
}

// --- ADMIN APIs ---

export async function adminLogin(username, password) {
  console.log("Attempting admin login to:", `${API_BASE}/api/admin/login`);
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await parseJson(res);
  if (data && data.token) {
    console.log("Login successful, token received.");
    setAdminToken(data.token);
  }
  return data;
}

// Admin Home
export async function fetchAdminHome() {
  const res = await fetch(`${API_BASE}/api/admin/home`, { headers: authHeaders() });
  return parseJson(res);
}
export async function createAdminHome(payload) {
  const res = await fetch(`${API_BASE}/api/admin/home`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function updateAdminHome(id, payload) {
  const res = await fetch(`${API_BASE}/api/admin/home/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function deleteAdminHome(id) {
  const res = await fetch(`${API_BASE}/api/admin/home/${id}`, { method: "DELETE", headers: authHeaders() });
  return parseJson(res);
}

// Admin About
export async function fetchAdminAbout() {
  const res = await fetch(`${API_BASE}/api/admin/about`, { headers: authHeaders() });
  return parseJson(res);
}
export async function createAdminAbout(payload) {
  const res = await fetch(`${API_BASE}/api/admin/about`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function updateAdminAbout(id, payload) {
  const res = await fetch(`${API_BASE}/api/admin/about/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function deleteAdminAbout(id) {
  const res = await fetch(`${API_BASE}/api/admin/about/${id}`, { method: "DELETE", headers: authHeaders() });
  return parseJson(res);
}

// Admin Skills
export async function fetchAdminSkills() {
  const res = await fetch(`${API_BASE}/api/admin/skills`, { headers: authHeaders() });
  return parseJson(res);
}
export async function createAdminSkill(payload) {
  const res = await fetch(`${API_BASE}/api/admin/skills`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function updateAdminSkill(id, payload) {
  const res = await fetch(`${API_BASE}/api/admin/skills/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function deleteAdminSkill(id) {
  const res = await fetch(`${API_BASE}/api/admin/skills/${id}`, { method: "DELETE", headers: authHeaders() });
  return parseJson(res);
}

// Admin Projects
export async function fetchAdminProjects() {
  const res = await fetch(`${API_BASE}/api/admin/projects`, { headers: authHeaders() });
  return parseJson(res);
}
export async function createAdminProject(payload) {
  const res = await fetch(`${API_BASE}/api/admin/projects`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function updateAdminProject(id, payload) {
  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function deleteAdminProject(id) {
  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, { method: "DELETE", headers: authHeaders() });
  return parseJson(res);
}

// Admin Experience
export async function fetchAdminExperience() {
  const res = await fetch(`${API_BASE}/api/admin/experience`, { headers: authHeaders() });
  return parseJson(res);
}
export async function createAdminExperience(payload) {
  const res = await fetch(`${API_BASE}/api/admin/experience`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function updateAdminExperience(id, payload) {
  const res = await fetch(`${API_BASE}/api/admin/experience/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function deleteAdminExperience(id) {
  const res = await fetch(`${API_BASE}/api/admin/experience/${id}`, { method: "DELETE", headers: authHeaders() });
  return parseJson(res);
}

// Admin Achievements
export async function fetchAdminAchievements() {
  const res = await fetch(`${API_BASE}/api/admin/achievements`, { headers: authHeaders() });
  return parseJson(res);
}
export async function createAdminAchievement(payload) {
  const res = await fetch(`${API_BASE}/api/admin/achievements`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function updateAdminAchievement(id, payload) {
  const res = await fetch(`${API_BASE}/api/admin/achievements/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}
export async function deleteAdminAchievement(id) {
  const res = await fetch(`${API_BASE}/api/admin/achievements/${id}`, { method: "DELETE", headers: authHeaders() });
  return parseJson(res);
}

// Admin Content Creator
export async function fetchAdminContentCreator() {
  const res = await fetch(`${API_BASE}/api/admin/content-creator`, { headers: authHeaders() });
  return parseJson(res);
}
export async function saveAdminContentCreator(payload) {
  const res = await fetch(`${API_BASE}/api/admin/content-creator`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}

// Admin Site Settings
export async function fetchAdminSiteSettings() {
  const res = await fetch(`${API_BASE}/api/admin/site-settings`, { headers: authHeaders() });
  return parseJson(res);
}
export async function saveAdminSiteSettings(payload) {
  const res = await fetch(`${API_BASE}/api/admin/site-settings`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}

// Admin Contact Settings
export async function fetchAdminContactSettings() {
  const res = await fetch(`${API_BASE}/api/admin/contact-settings`, { headers: authHeaders() });
  return parseJson(res);
}
export async function saveAdminContactSettings(payload) {
  const res = await fetch(`${API_BASE}/api/admin/contact-settings`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
  return parseJson(res);
}

// Admin Messages
export async function fetchAdminMessages() {
  const res = await fetch(`${API_BASE}/api/admin/messages`, { headers: authHeaders() });
  return parseJson(res);
}
export async function deleteAdminMessage(id) {
  const res = await fetch(`${API_BASE}/api/admin/message/${id}`, { method: "DELETE", headers: authHeaders() });
  return parseJson(res);
}

// Admin Upload
export async function adminUploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    headers: authHeaders(false), // FormData handles Content-Type automatically
    body: formData,
  });
  return parseJson(res);
}
