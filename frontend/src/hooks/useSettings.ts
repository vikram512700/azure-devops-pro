"use client";

import { useState, useEffect } from "react";

export function useSettings() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("azure-devops-api-key");
    if (saved) {
      setApiKey(saved);
    }
    setIsLoaded(true);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("azure-devops-api-key", key);
  };

  return { apiKey, saveApiKey, isLoaded };
}
