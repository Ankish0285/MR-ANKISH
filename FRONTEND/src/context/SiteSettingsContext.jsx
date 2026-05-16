import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchSiteSettings } from "../services/api.js";

const SiteSettingsContext = createContext({
  loading: true,
  visibility: {},
  isVisible: () => true,
  refresh: async () => {},
});

export function SiteSettingsProvider({ children }) {
  const [visibility, setVisibility] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const v = await fetchSiteSettings();
      setVisibility(v || {});
    } catch (e) {
      if (e.message !== "Network error — from FRONTEND run npm run dev (API + site), or start Flask in BACKEND." && 
          !e.message?.includes("Unexpected token")) {
        console.error("Failed to fetch site settings", e);
      }
      setVisibility({});
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
    () => ({ loading, visibility, isVisible, refresh }),
    [loading, visibility, isVisible, refresh]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
