const API_BASE = "/api";

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
    const hint =
      res.status === 503 || res.status === 502 || res.status === 500
        ? " From FRONTEND run npm run dev so Flask starts on port 5000, or run python app.py in BACKEND."
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

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  const data = await parseJson(res);
  return Array.isArray(data) ? data : data.projects || [];
}

export async function fetchSiteSettings() {
  const res = await fetch(`${API_BASE}/site-settings`);
  const data = await parseJson(res);
  return data.visibility || {};
}

export async function fetchHomePublic() {
  const res = await fetch(`${API_BASE}/home`);
  const data = await parseJson(res);
  return data.item ?? null;
}

export async function fetchAboutPublic() {
  const res = await fetch(`${API_BASE}/about`);
  const data = await parseJson(res);
  return data.item ?? null;
}

export async function fetchSkillsPublic() {
  const res = await fetch(`${API_BASE}/skills`);
  const data = await parseJson(res);
  return Array.isArray(data) ? data : [];
}

export async function fetchExperiencePublic() {
  const res = await fetch(`${API_BASE}/experience`);
  const data = await parseJson(res);
  return Array.isArray(data) ? data : [];
}

export async function fetchBlogPublic() {
  const res = await fetch(`${API_BASE}/blog`);
  const data = await parseJson(res);
  return Array.isArray(data) ? data : [];
}

export async function fetchAchievementsPublic() {
  const res = await fetch(`${API_BASE}/achievements`);
  const data = await parseJson(res);
  return Array.isArray(data) ? data : [];
}

export async function fetchContentCreatorPublic() {
  const res = await fetch(`${API_BASE}/content-creator`);
  return parseJson(res);
}

export async function sendContact(payload) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function adminLogin(username, password) {
  let res;
  try {
    res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error(
      "Network error — from FRONTEND run npm run dev (API + site), or start Flask in BACKEND."
    );
  }
  const data = await parseJson(res);
  if (data.token) setAdminToken(data.token);
  return data;
}

export async function adminFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}/admin${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
      window.location.assign("/admin/login");
    }
  }
  return parseJson(res);
}

export async function adminUploadImage(file) {
  const token = getAdminToken();
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
      window.location.assign("/admin/login");
    }
  }
  return parseJson(res);
}

export async function fetchAdminMessages() {
  return adminFetch("/messages");
}

export async function deleteAdminMessage(id) {
  return adminFetch(`/message/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchAdminProjects() {
  return adminFetch("/projects");
}

export async function createAdminProject(payload) {
  return adminFetch("/project", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProject(id, payload) {
  return adminFetch(`/project/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProject(id) {
  return adminFetch(`/project/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchAdminHome() {
  return adminFetch("/home");
}

export async function createAdminHome(payload) {
  return adminFetch("/home", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminHome(id, payload) {
  return adminFetch(`/home/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminHome(id) {
  return adminFetch(`/home/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchAdminAbout() {
  return adminFetch("/about");
}

export async function createAdminAbout(payload) {
  return adminFetch("/about", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminAbout(id, payload) {
  return adminFetch(`/about/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminAbout(id) {
  return adminFetch(`/about/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchAdminSkills() {
  return adminFetch("/skills");
}

export async function createAdminSkill(payload) {
  return adminFetch("/skills", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminSkill(id, payload) {
  return adminFetch(`/skills/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminSkill(id) {
  return adminFetch(`/skills/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchAdminExperience() {
  return adminFetch("/experience");
}

export async function createAdminExperience(payload) {
  return adminFetch("/experience", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminExperience(id, payload) {
  return adminFetch(`/experience/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminExperience(id) {
  return adminFetch(`/experience/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchAdminAchievements() {
  return adminFetch("/achievements");
}

export async function createAdminAchievement(payload) {
  return adminFetch("/achievements", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminAchievement(id, payload) {
  return adminFetch(`/achievements/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminAchievement(id) {
  return adminFetch(`/achievements/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function fetchAdminContentCreator() {
  return adminFetch("/content-creator");
}

export async function saveAdminContentCreator(payload) {
  return adminFetch("/content-creator", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminSiteSettings() {
  return adminFetch("/site-settings");
}

export async function saveAdminSiteSettings(visibility) {
  return adminFetch("/site-settings", {
    method: "PUT",
    body: JSON.stringify({ visibility }),
  });
}

export async function fetchContactSettingsPublic() {
  const res = await fetch(`${API_BASE}/contact-settings`);
  return parseJson(res);
}

export async function fetchAdminContactSettings() {
  return adminFetch("/contact-settings");
}

export async function saveAdminContactSettings(payload) {
  return adminFetch("/contact-settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
