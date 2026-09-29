"use client";

import { useState, useCallback } from "react";
import { tourData } from "@/app/configs/tourData";

export function useTour() {
  const [currentScene, setCurrentScene] = useState(
    tourData.default.firstScene
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);

  const handleSceneChange = useCallback((sceneId: string) => {
    setCurrentScene(sceneId);
    setInfoPanelOpen(false);
  }, []);

  const handleSceneSelect = useCallback((sceneId: string) => {
    setCurrentScene(sceneId);
    setInfoPanelOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleInfoPanel = useCallback(() => {
    setInfoPanelOpen((prev) => !prev);
  }, []);

  const openInfoPanel = useCallback(() => {
    setInfoPanelOpen(true);
  }, []);

  const currentSceneData = tourData.scenes[currentScene];

  return {
    currentScene,
    currentSceneData,
    sidebarOpen,
    infoPanelOpen,
    handleSceneChange,
    handleSceneSelect,
    toggleSidebar,
    toggleInfoPanel,
    openInfoPanel,
    tourConfig: tourData,
  };
}
