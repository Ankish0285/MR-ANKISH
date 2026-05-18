# API Usage Guide - Frontend Integration

This guide shows how to use the API in your React components with both Axios and Fetch API.

## Table of Contents
1. [Axios Examples](#axios-examples)
2. [Fetch API Examples](#fetch-api-examples)
3. [React Hooks for API Calls](#react-hooks-for-api-calls)
4. [Error Handling](#error-handling)
5. [Authentication & Protected Routes](#authentication--protected-routes)

---

## Axios Examples

### Setup (Already Configured)

```javascript
// FRONTEND/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // http://localhost:5000 (dev) or https://... (prod)
  withCredentials: true,  // Include cookies in requests
});

export default API;
```

### Public Data Endpoints

```javascript
// Get all projects
import API from '@/services/api';

async function loadProjects() {
  try {
    const response = await API.get('/projects');
    const projects = response.data.projects; // Array of projects
    console.log('Projects loaded:', projects);
  } catch (error) {
    console.error('Failed to load projects:', error.message);
  }
}

// Get home section
async function loadHome() {
  try {
    const response = await API.get('/home');
    const home = response.data.item; // Single home object
    console.log('Home data:', home);
  } catch (error) {
    console.error('Failed to load home:', error.message);
  }
}

// Get all skills
async function loadSkills() {
  try {
    const response = await API.get('/skills');
    const skills = response.data; // Array of skills
    console.log('Skills:', skills);
  } catch (error) {
    return [];
  }
}
```

### Using Pre-Built Service Functions

```javascript
// FRONTEND/src/services/api.js already has helper functions
import {
  fetchProjects,
  fetchHomePublic,
  fetchAboutPublic,
  fetchExperiencePublic,
  fetchAchievementsPublic,
  fetchSkillsPublic,
  submitContact,
} from '@/services/api';

// In your component:
async function loadData() {
  const projects = await fetchProjects();
  const home = await fetchHomePublic();
  const skills = await fetchSkillsPublic();
  
  console.log({ projects, home, skills });
}
```

### Admin Endpoints (Requires Login)

```javascript
import {
  adminLogin,
  fetchAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
} from '@/services/api';

// Login
async function login() {
  try {
    const data = await adminLogin('admin@example.com', 'password123');
    console.log('Login successful:', data.token);
    // Token is automatically stored in localStorage
    // and included in all subsequent requests
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Fetch admin projects
async function getAdminProjects() {
  try {
    const data = await fetchAdminProjects();
    console.log('Admin projects:', data.projects);
  } catch (error) {
    console.error('Failed to fetch:', error.message);
  }
}

// Create project
async function createProject(projectData) {
  try {
    const response = await createAdminProject({
      title: 'My Project',
      description: 'Project description',
      link: 'https://example.com',
      tech: ['React', 'Python'],
      image: 'https://example.com/image.jpg',
    });
    console.log('Project created:', response);
  } catch (error) {
    console.error('Failed to create:', error.message);
  }
}

// Update project
async function updateProject(projectId, updatedData) {
  try {
    const response = await updateAdminProject(projectId, {
      title: 'Updated Title',
      description: 'Updated description',
    });
    console.log('Project updated:', response);
  } catch (error) {
    console.error('Failed to update:', error.message);
  }
}

// Delete project
async function deleteProject(projectId) {
  try {
    await deleteAdminProject(projectId);
    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Failed to delete:', error.message);
  }
}
```

### File Upload

```javascript
import { adminUploadImage } from '@/services/api';

async function uploadImage(file) {
  try {
    const response = await adminUploadImage(file);
    console.log('Image URL:', response.image_url);
    // Use response.image_url in your form
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

// In a React form:
function ImageUploadForm() {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await uploadImage(file);
      setImageUrl(data.image_url);
    }
  };

  return <input type="file" onChange={handleFileChange} accept="image/*" />;
}
```

### Submit Contact Form

```javascript
import { submitContact } from '@/services/api';

async function handleContactSubmit(formData) {
  try {
    const response = await submitContact({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry',
      message: 'Your message here',
    });
    console.log('Message sent:', response);
    // Show success message to user
  } catch (error) {
    console.error('Failed to send:', error.message);
    // Show error message to user
  }
}
```

---

## Fetch API Examples

### Setup (Alternative to Axios)

```javascript
// FRONTEND/src/services/api-fetch.js
// This file is already created and has the same functions as api.js
// But uses native Fetch instead of Axios

import * as ApiService from '@/services/api-fetch';

// Use exactly the same way as Axios version:
const projects = await ApiService.fetchProjects();
const home = await ApiService.fetchHomePublic();
```

### Using Fetch API Directly

```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Simple GET request
async function getProjects() {
  try {
    const response = await fetch(`${API_URL}/api/projects`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Projects:', data.projects);
  } catch (error) {
    console.error('Error:', error);
  }
}

// GET with authentication
async function getAdminProjects() {
  const token = localStorage.getItem('admin_token');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
    });
    
    const data = await response.json();
    console.log('Admin projects:', data.projects);
  } catch (error) {
    console.error('Error:', error);
  }
}

// POST request
async function createProject(projectData) {
  const token = localStorage.getItem('admin_token');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(projectData),
    });
    
    const data = await response.json();
    console.log('Created:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// PUT request (update)
async function updateProject(projectId, updates) {
  const token = localStorage.getItem('admin_token');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    
    const data = await response.json();
    console.log('Updated:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// DELETE request
async function deleteProject(projectId) {
  const token = localStorage.getItem('admin_token');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    const data = await response.json();
    console.log('Deleted:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// File upload with FormData
async function uploadImage(file) {
  const token = localStorage.getItem('admin_token');
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData, // Don't set Content-Type for FormData
    });
    
    const data = await response.json();
    console.log('Image URL:', data.image_url);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## React Hooks for API Calls

### useEffect Hook for Loading Data

```javascript
import { useEffect, useState } from 'react';
import { fetchProjects } from '@/services/api';

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []); // Run once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {projects.map(project => (
        <li key={project._id}>{project.title}</li>
      ))}
    </ul>
  );
}
```

### Custom Hook for API Calls

```javascript
// FRONTEND/src/hooks/useAPI.js
import { useState, useEffect } from 'react';

export function useAPI(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await apiFunction();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

// Usage:
import { useAPI } from '@/hooks/useAPI';
import { fetchProjects } from '@/services/api';

function MyComponent() {
  const { data: projects, loading, error } = useAPI(fetchProjects);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{projects?.length} projects loaded</div>;
}
```

### Custom Hook for Mutations (Create/Update/Delete)

```javascript
// FRONTEND/src/hooks/useMutation.js
import { useState } from 'react';

export function useMutation(mutationFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}

// Usage:
import { useMutation } from '@/hooks/useMutation';
import { createAdminProject, deleteAdminProject } from '@/services/api';

function AdminPanel() {
  const { mutate: createProject, loading } = useMutation(createAdminProject);

  const handleCreate = async () => {
    try {
      await createProject({
        title: 'New Project',
        description: 'Description',
      });
      // Refresh data after creation
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creating...' : 'Create Project'}
    </button>
  );
}
```

---

## Error Handling

### Global Error Handler

```javascript
// FRONTEND/src/services/api.js already has this:
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    const msg = (res?.data?.error || res?.data?.message) || error.message;
    console.error(`API Error [${res?.status}]: ${msg}`);
    return Promise.reject(new Error(msg));
  }
);
```

### Component-Level Error Handling

```javascript
function MyComponent() {
  const [error, setError] = useState(null);

  const handleAction = async () => {
    try {
      setError(null);
      const result = await someAPICall();
      // Process result
    } catch (err) {
      // Show user-friendly error message
      setError(err.message);
      
      // Log to analytics
      console.error('Action failed:', err);
    }
  };

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      <button onClick={handleAction}>Action</button>
    </>
  );
}
```

### Handle Different Error Types

```javascript
async function handleRequest() {
  try {
    const response = await API.get('/admin/data');
    return response.data;
  } catch (error) {
    // Network error
    if (!error.response) {
      console.error('Network error - backend unreachable');
      throw new Error('Backend is not responding. Please check your connection.');
    }

    // 401 Unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
      throw new Error('Session expired. Please login again.');
    }

    // 403 Forbidden
    if (error.response.status === 403) {
      throw new Error('You do not have permission for this action.');
    }

    // 404 Not Found
    if (error.response.status === 404) {
      throw new Error('Resource not found.');
    }

    // 500 Server Error
    if (error.response.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    // Default error
    throw error;
  }
}
```

---

## Authentication & Protected Routes

### Login Flow

```javascript
// FRONTEND/src/pages/AdminLogin.jsx
import { useState } from 'react';
import { adminLogin, clearAdminToken } from '@/services/api';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setLoading(true);
      
      const data = await adminLogin(email, password);
      // Token is automatically stored by adminLogin()
      
      console.log('Login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Protected Routes

```javascript
// FRONTEND/src/components/ProtectedRoute.jsx
import { getAdminToken } from '@/services/api';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Usage in Router:
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminDashboard } from '@/pages/AdminDashboard';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Logout

```javascript
// FRONTEND/src/components/AdminHeader.jsx
import { clearAdminToken } from '@/services/api';

function AdminHeader() {
  const handleLogout = () => {
    clearAdminToken();
    window.location.href = '/admin/login';
  };

  return (
    <header>
      <h1>Admin Panel</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}
```

---

## Summary

**Using Axios (Recommended for this project):**
```javascript
import { fetchProjects, createAdminProject } from '@/services/api';
```

**Using Fetch API (Lighter alternative):**
```javascript
import { fetchProjects, createAdminProject } from '@/services/api-fetch';
```

Both have identical APIs and are fully compatible. Choose based on your project requirements!
