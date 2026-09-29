"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import NavigationSidebar from "../components/NavigationSidebar";
import SceneInfo from "../components/SceneInfo";
import { getSceneList } from "../configs/tourData";
import { useTour } from "../hooks/useTour";

const PannellumViewer = dynamic(() => import("../components/PannellumViewer"), {
  ssr: false,
  loading: () => <div className="viewer-module-loading" aria-hidden="true" />,
});

export default function TourPage() {
  const [navigationMode, setNavigationMode] = useState<"menu" | "scenes">(
    "scenes"
  );
  const {
    currentScene,
    currentSceneData,
    sidebarOpen,
    infoPanelOpen,
    handleSceneChange,
    handleSceneSelect,
    toggleSidebar,
    toggleInfoPanel,
    openInfoPanel,
    tourConfig,
  } = useTour();

  const scenes = getSceneList();
  const sceneIndex = Math.max(
    0,
    scenes.findIndex((scene) => scene.id === currentScene)
  );
  const infoHotSpots =
    currentSceneData?.hotSpots.filter(
      (hotspot) =>
        hotspot.type === "info" &&
        hotspot.variant !== "inline-info" &&
        hotspot.variant !== "label"
    ) ?? [];

  const showNavigation = (mode: "menu" | "scenes") => {
    if (sidebarOpen && navigationMode === mode) {
      toggleSidebar();
      return;
    }

    setNavigationMode(mode);
    if (!sidebarOpen) toggleSidebar();
  };

  return (
    <main className="tour-shell">
      <PannellumViewer
        config={tourConfig}
        currentScene={currentScene}
        onSceneChange={handleSceneChange}
        onInfoRequest={openInfoPanel}
      />

      <header className="tour-topbar">
        <div className="tour-topbar-left">
          <Link href="/" className="tour-icon-button tour-exit" aria-label="Kembali ke beranda">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Keluar</span>
          </Link>

        </div>

        <div className="tour-topbar-actions">
          {infoHotSpots.length > 0 && (
            <button
              type="button"
              className={`tour-icon-button${infoPanelOpen ? " is-active" : ""}`}
              onClick={toggleInfoPanel}
              aria-label="Tampilkan informasi ruangan"
              aria-pressed={infoPanelOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                <path d="M12 11v5M12 8v.01" />
              </svg>
              <span>Info</span>
            </button>
          )}
          <button
            type="button"
            className={`tour-icon-button${
              sidebarOpen && navigationMode === "menu" ? " is-active" : ""
            }`}
            onClick={() => showNavigation("menu")}
            aria-label="Buka menu utama"
            aria-expanded={sidebarOpen && navigationMode === "menu"}
            aria-controls="tour-navigation-drawer"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Menu</span>
          </button>
        </div>
      </header>

      <section className="tour-scene-dock" aria-label="Ruangan aktif">
        <span className="scene-number">{String(sceneIndex + 1).padStart(2, "0")}</span>
        <div className="scene-current-copy">
          <h1>{currentSceneData?.title}</h1>
          {currentSceneData?.status === "preview" && (
            <span><i>Mode demo</i></span>
          )}
        </div>
        <button
          type="button"
          onClick={() => showNavigation("scenes")}
          className="scene-explore-button"
          aria-expanded={sidebarOpen && navigationMode === "scenes"}
          aria-controls="tour-navigation-drawer"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m4 6 6-2 4 2 6-2v14l-6 2-4-2-6 2V6Z" />
            <path d="M10 4v14M14 6v14" />
          </svg>
          <span>Pilih ruang</span>
        </button>
      </section>

      <NavigationSidebar
        currentScene={currentScene}
        onSceneSelect={handleSceneSelect}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        mode={navigationMode}
        onShowScenes={() => setNavigationMode("scenes")}
      />

      <SceneInfo
        title={currentSceneData?.title ?? ""}
        status={currentSceneData?.status ?? "preview"}
        infoHotSpots={infoHotSpots}
        isVisible={infoPanelOpen}
        onClose={toggleInfoPanel}
      />

      <span className="sr-only" aria-live="polite">
        Ruangan aktif: {currentSceneData?.title}
      </span>
    </main>
  );
}
