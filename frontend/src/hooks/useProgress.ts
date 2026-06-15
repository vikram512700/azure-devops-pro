"use client";

import { useState, useEffect } from "react";

export interface UserProgress {
  xp: number;
  completedModules: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  completedModules: [],
};

export const BADGES = [
  { id: "rookie", name: "Cloud Rookie", desc: "Earned 100 XP", icon: "Shield", threshold: 100 },
  { id: "engineer", name: "Cloud Engineer", desc: "Earned 500 XP", icon: "Medal", threshold: 500 },
  { id: "architect", name: "Azure Architect", desc: "Earned 1000 XP", icon: "Trophy", threshold: 1000 },
  { id: "sre", name: "Senior SRE", desc: "Earned 2000 XP", icon: "Crown", threshold: 2000 },
];

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("azure-devops-progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem("azure-devops-progress", JSON.stringify(newProgress));
  };

  const addXP = (amount: number) => {
    saveProgress({
      ...progress,
      xp: progress.xp + amount,
    });
  };

  const markModuleCompleted = (moduleId: string) => {
    if (!progress.completedModules.includes(moduleId)) {
      saveProgress({
        ...progress,
        completedModules: [...progress.completedModules, moduleId],
      });
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.completedModules.includes(moduleId);
  };

  const unlockedBadges = BADGES.filter(b => progress.xp >= b.threshold);

  return {
    progress,
    isLoaded,
    unlockedBadges,
    addXP,
    markModuleCompleted,
    isModuleCompleted,
  };
}
