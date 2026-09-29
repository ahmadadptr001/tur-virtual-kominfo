"use client";

import type { HotSpot, Scene } from "@/app/configs/tourData";

interface SceneInfoProps {
  title: string;
  status: Scene["status"];
  infoHotSpots: HotSpot[];
  isVisible: boolean;
  onClose: () => void;
}

export default function SceneInfo({
  title,
  status,
  infoHotSpots,
  isVisible,
  onClose,
}: SceneInfoProps) {
  if (!isVisible) return null;

  return (
    <section className="scene-info-card" aria-labelledby="scene-info-title">
      <header>
        <span className="scene-info-icon" aria-hidden="true">i</span>
        <div>
          <h2 id="scene-info-title">{title}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup informasi ruangan">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </header>

      {status === "preview" && (
        <div className="scene-preview-note">
          <span aria-hidden="true" />
          Panorama ruangan ini masih memakai pratinjau lobi.
        </div>
      )}

      {infoHotSpots.length > 0 && (
        <div className="scene-facts">
          {infoHotSpots.map((hotspot, index) => (
            <div key={`${hotspot.yaw}-${index}`}>
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path d="M12 11v5M12 8v.01" />
                </svg>
              </span>
              <p>{hotspot.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
