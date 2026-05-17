// Production: Use deployed backend URL from env, Dev: Use relative path with local proxy
const API_BASE = import.meta.env.VITE_API_URL || "";

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
      ? " Backend API is unreachable. Ensure Render backend is running."
      : "";
    throw new Error(
      text?.trim()
        ? `Server returned non-JSON (${res.status}).${hint}`
        : `Bad response (${res.status} ${res.statusText}).${hint}`
    );
  }
  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}

function authHeaders(json = true) {
  const token = getAdminToken();
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
    // Backend returns { success: true, projects: [...] }
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
    // Backend returns a direct array [ {id, name, level}, ... ]
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

export async function submitContact(payload) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

// --- ADMIN APIs ---

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ username, password }),
  });
  return parseJson(res);
}

export async function fetchAdminMessages() {
  const res = await fetch(`${API_BASE}/api/admin/messages`, {
    headers: authHeaders(),
  });
  return parseJson(res);
}

export async function deleteAdminMessage(id) {
  const res = await fetch(`${API_BASE}/api/admin/message/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return parseJson(res);
}
