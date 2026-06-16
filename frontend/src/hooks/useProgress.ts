"use client";

import { useState, useEffect } from "react";

export interface UserProgress {
  xp: number;
  completedModules: string[];
  completedProjects: string[];
  projectXp: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  completedModules: [],
  completedProjects: [],
  projectXp: 0,
};

export const BADGES = [
  { id: "rookie", name: "Cloud Rookie", desc: "Earned 100 XP", icon: "Shield", threshold: 100 },
  { id: "engineer", name: "Cloud Engineer", desc: "Earned 500 XP", icon: "Medal", threshold: 500 },
  { id: "architect", name: "Azure Architect", desc: "Earned 1000 XP", icon: "Trophy", threshold: 1000 },
  { id: "sre", name: "Senior SRE", desc: "Earned 2000 XP", icon: "Crown", threshold: 2000 },
  { id: "first-build", name: "First Build", desc: "Earned 3000 XP", icon: "Rocket", threshold: 3000 },
  { id: "builder", name: "Builder", desc: "Earned 4000 XP", icon: "Settings2", threshold: 4000 },
  { id: "portfolio-ready", name: "Portfolio Ready", desc: "Earned 5000 XP", icon: "Briefcase", threshold: 5000 },
  { id: "platform-engineer", name: "Platform Engineer", desc: "Earned 8000 XP", icon: "Diamond", threshold: 8000 },
];

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("azure-devops-progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Safe migration for older progress states
        setProgress({
          ...DEFAULT_PROGRESS,
          ...parsed,
          completedProjects: parsed.completedProjects || [],
          projectXp: parsed.projectXp || 0,
        });
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

  const markProjectCompleted = (projectId: string, xpReward: number) => {
    if (!progress.completedProjects.includes(projectId)) {
      saveProgress({
        ...progress,
        completedProjects: [...progress.completedProjects, projectId],
        projectXp: progress.projectXp + xpReward,
        xp: progress.xp + xpReward,
      });
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.completedModules.includes(moduleId);
  };

  const isProjectCompleted = (projectId: string) => {
    return progress.completedProjects.includes(projectId);
  };

  const unlockedBadges = BADGES.filter(b => progress.xp >= b.threshold);

  const exportProgress = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "azure_devops_progress.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importProgress = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed.xp === 'number' && Array.isArray(parsed.completedModules)) {
        saveProgress({
          ...DEFAULT_PROGRESS,
          ...parsed,
          completedProjects: parsed.completedProjects || [],
          projectXp: parsed.projectXp || 0,
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to parse progress file", e);
      return false;
    }
  };

  return {
    progress,
    isLoaded,
    unlockedBadges,
    addXP,
    markModuleCompleted,
    markProjectCompleted,
    isModuleCompleted,
    isProjectCompleted,
    exportProgress,
    importProgress,
  };
}
