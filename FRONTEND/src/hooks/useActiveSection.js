import { useEffect, useState } from "react";

const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "blog",
  "contact",
];

export function useActiveSection() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-12% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}
