import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchSiteSettings, fetchContactSettingsPublic } from "../services/api.js";

const SiteSettingsContext = createContext({
  loading: true,
  visibility: {},
  contact: {},
  isVisible: () => true,
  refresh: async () => {},
});

export function SiteSettingsProvider({ children }) {
  const [visibility, setVisibility] = useState({});
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [v, c] = await Promise.all([fetchSiteSettings(), fetchContactSettingsPublic()]);
      setVisibility(v.visibility || {});
      setContact(c || {});
    } catch (e) {
      console.error("Failed to fetch site settings", e);
      setVisibility({});
      setContact({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isVisible = useCallback(
    (key) => {
      if (visibility[key] === false) return false;
      return true;
    },
    [visibility]
  );

  const value = useMemo(
    () => ({ loading, visibility, contact, isVisible, refresh }),
    [loading, visibility, contact, isVisible, refresh]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
