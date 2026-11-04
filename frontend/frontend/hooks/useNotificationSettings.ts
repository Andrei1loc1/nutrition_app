import { useState, useEffect } from "react";

const KEY = "neurosnap-notifications-enabled";

export function useNotificationSettings() {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    setEnabled(raw === "true");
  }, []);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(KEY, String(next));
      }
      return next;
    });
  };

  return { enabled, toggle };
}
