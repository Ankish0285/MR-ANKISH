/** Shown when /api/projects is unreachable (Flask off or network). */
export const FALLBACK_PROJECTS = [
  {
    id: "fallback-1",
    title: "This portfolio",
    description:
      "React + Vite + Tailwind on the frontend; Flask + MongoDB for contact, projects, and admin. Start the backend to replace this card with your real data.",
    tech_stack: "React,Flask,MongoDB,Tailwind CSS",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    github_url: "https://github.com",
    demo_url: null,
    url: null,
  },
  {
    id: "fallback-2",
    title: "REST APIs",
    description:
      "Blueprint-based routes, JSON APIs, and optional email on contact — wire your own GitHub and live links in the admin panel.",
    tech_stack: "Python,Flask,pymongo",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    github_url: "https://github.com",
    demo_url: null,
    url: null,
  },
];
