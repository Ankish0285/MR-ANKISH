import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import PageLoader from "../components/PageLoader.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import { SiteSettingsProvider, useSiteSettings } from "../context/SiteSettingsContext.jsx";
import About from "../sections/About.jsx";
import Achievements from "../sections/Achievements.jsx";
import Contact from "../sections/Contact.jsx";
import Experience from "../sections/Experience.jsx";
import Hero from "../sections/Hero.jsx";
import Projects from "../sections/Projects.jsx";
import Skills from "../sections/Skills.jsx";

function PublicContent() {
  const { isVisible } = useSiteSettings();
  return (
    <>
      <PageLoader />
      <Navbar />
      <main>
        {isVisible("hero") ? <Hero /> : null}
        {isVisible("about") ? <About /> : null}
        {isVisible("skills") ? <Skills /> : null}
        {isVisible("projects") ? <Projects /> : null}
        {isVisible("experience") ? <Experience /> : null}
        {isVisible("blog") ? <Achievements /> : null}
        {isVisible("contact") ? <Contact /> : null}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default function PublicSite() {
  return (
    <SiteSettingsProvider>
      <PublicContent />
    </SiteSettingsProvider>
  );
}
