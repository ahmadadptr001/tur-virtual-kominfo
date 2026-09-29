"use client";

import { getSceneList } from "@/app/configs/tourData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface NavigationSidebarProps {
  currentScene: string;
  onSceneSelect: (sceneId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  mode: "menu" | "scenes";
  onShowScenes: () => void;
}

export default function NavigationSidebar({
  currentScene,
  onSceneSelect,
  isOpen,
  onToggle,
  mode,
  onShowScenes,
}: NavigationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const layerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scenes = getSceneList();
  const readyScenes = scenes.filter((scene) => scene.status === "ready").length;
  const previewScenes = scenes.length - readyScenes;
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("id-ID");
  const filteredScenes = scenes
    .map((scene, index) => ({ scene, index }))
    .filter(({ scene }) =>
      scene.title.toLocaleLowerCase("id-ID").includes(normalizedQuery)
    );

  useEffect(() => {
    if (!isOpen) return;

    const layer = layerRef.current;
    const drawer = drawerRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const shell = layer?.parentElement;
    const inertSiblings = shell
      ? Array.from(shell.children).filter(
          (element): element is HTMLElement =>
            element instanceof HTMLElement && element !== layer
        )
      : [];
    const previousInert = inertSiblings.map((element) => element.inert);

    inertSiblings.forEach((element) => {
      element.inert = true;
    });

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onToggle();
        return;
      }

      if (event.key !== "Tab" || !drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      inertSiblings.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      previousFocus?.focus();
    };
  }, [isOpen, onToggle]);

  if (!isOpen) return null;

  return (
    <div ref={layerRef} className="navigation-layer">
      <button
        type="button"
        className="navigation-scrim"
        onClick={onToggle}
        aria-label="Tutup menu"
      />

      <aside
        ref={drawerRef}
        id="tour-navigation-drawer"
        className="navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-navigation-title"
      >
        <header className="navigation-header">
          <div>
            <h2 id="tour-navigation-title">
              {mode === "menu" ? "Menu" : "Pilih ruangan"}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onToggle}
            aria-label="Tutup menu"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {mode === "menu" ? (
          <nav className="tour-menu-list" aria-label="Menu utama">
            <Link href="/" className="tour-menu-item">
              <span className="tour-menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4v-9Z" />
                </svg>
              </span>
              <span>
                <strong>Beranda</strong>
                <small>Kembali ke halaman utama</small>
              </span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              type="button"
              className="tour-menu-item"
              onClick={() => {
                onSceneSelect("lobby");
                onToggle();
              }}
            >
              <span className="tour-menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path d="m12 7 3 5-3 5-3-5 3-5Z" />
                </svg>
              </span>
              <span>
                <strong>Mulai dari awal</strong>
                <small>Kembali ke tampak depan gedung</small>
              </span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="tour-menu-item"
              onClick={onShowScenes}
            >
              <span className="tour-menu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m4 6 6-2 4 2 6-2v14l-6 2-4-2-6 2V6Z" />
                  <path d="M10 4v14M14 6v14" />
                </svg>
              </span>
              <span>
                <strong>Pilih ruangan</strong>
                <small>Buka daftar panorama</small>
              </span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        ) : (
          <>
            <div className="navigation-summary">
              <span>{scenes.length} ruang</span>
              <span>
                <i aria-hidden="true" /> {readyScenes} foto 360°
              </span>
            </div>

            <label className="scene-search">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
              <span className="sr-only">Cari ruangan</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari ruangan"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 7l10 10M17 7 7 17" />
                  </svg>
                </button>
              )}
            </label>

            <nav className="scene-list">
              {filteredScenes.map(({ scene, index }) => {
                const isActive = currentScene === scene.id;

                return (
                  <button
                    type="button"
                    key={scene.id}
                    className={`scene-list-item${isActive ? " is-active" : ""}`}
                    onClick={() => {
                      onSceneSelect(scene.id);
                      onToggle();
                    }}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span className="scene-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="scene-list-copy">
                      <strong>{scene.title}</strong>
                    </span>
                    <span className={`scene-state ${scene.status}`}>
                      {scene.status === "ready" ? "360°" : "Demo"}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
              {filteredScenes.length === 0 && (
                <p className="scene-search-empty">
                  Ruangan “{searchQuery.trim()}” tidak ditemukan.
                </p>
              )}
            </nav>

            {previewScenes > 0 && (
              <footer className="navigation-footer">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path d="M12 8v5M12 16.5v.01" />
                </svg>
                <p>
                  {previewScenes} scene <strong>Demo</strong> menunggu foto 360°.
                </p>
              </footer>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
