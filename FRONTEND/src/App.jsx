// Normalizing casing to frontend tree
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/admin/RequireAuth.jsx";
import PublicSite from "./pages/PublicSite.jsx";
import ContentCreator from "./pages/ContentCreator.jsx";
import AdminAbout from "./pages/admin/AdminAbout.jsx";
import AdminAchievements from "./pages/admin/AdminAchievements.jsx";
import AdminContentCreator from "./pages/admin/AdminContentCreator.jsx";
import AdminContactPage from "./pages/admin/AdminContactPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminExperience from "./pages/admin/AdminExperience.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminSkills from "./pages/admin/AdminSkills.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="content-creator" element={<AdminContentCreator />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="contact-page" element={<AdminContactPage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
        <Route path="/" element={<PublicSite />} />
        <Route path="/content-creator" element={<ContentCreator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
