"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type {
  PannellumConfig,
  PannellumViewer as PannellumViewerApi,
} from "pannellum";
import type { TourConfig } from "@/app/configs/tourData";

interface PannellumViewerProps {
  config: TourConfig;
  currentScene: string;
  onSceneChange: (sceneId: string) => void;
  onInfoRequest: () => void;
}

type ViewerPhase = "booting" | "ready" | "switching" | "error";

type ViewerFactory = (
  container: HTMLElement,
  config: PannellumConfig
) => PannellumViewerApi;

const createDoorHotSpot = (element: HTMLElement, labelValue: unknown) => {
  const label = typeof labelValue === "string" ? labelValue : "Masuk";
  const icon = document.createElement("span");
  const copy = document.createElement("span");

  icon.className = "door-hotspot-icon";
  copy.className = "door-hotspot-label";
  copy.textContent = label;

  element.setAttribute("role", "button");
  element.setAttribute("aria-label", `Masuk ke ${label}`);
  element.tabIndex = 0;
  element.append(icon, copy);
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      element.click();
    }
  });
};

const createArrowHotSpot = (
  element: HTMLElement,
  labelValue: unknown
) => {
  const label = typeof labelValue === "string" ? labelValue : "ruangan berikutnya";
  const icon = document.createElement("span");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  icon.className = "arrow-hotspot-icon";
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("d", "m7 14 5-5 5 5");
  svg.append(path);
  icon.append(svg);

  element.setAttribute("role", "button");
  element.setAttribute("aria-label", `Menuju ${label}`);
  element.tabIndex = 0;
  element.append(icon);
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      element.click();
    }
  });
};

const createSceneLabel = (element: HTMLElement, labelValue: unknown) => {
  const label = typeof labelValue === "string" ? labelValue : "Lokasi";
  element.textContent = label;
  element.setAttribute("role", "note");
  element.setAttribute("aria-label", label);
};

interface InlineInfoArgs {
  label: string;
  title: string;
  side: "left" | "right";
  focus: () => void;
}

const createInlineInfoHotSpot = (
  element: HTMLElement,
  argsValue: unknown
) => {
  const args = argsValue as Partial<InlineInfoArgs>;
  const label = typeof args.label === "string" ? args.label : "Informasi";
  const title = typeof args.title === "string" ? args.title : "Informasi";
  const side = args.side === "left" ? "left" : "right";
  const icon = document.createElement("span");
  const popup = document.createElement("span");
  const heading = document.createElement("strong");
  const copy = document.createElement("span");

  icon.className = "inline-info-icon";
  icon.textContent = "i";
  popup.className = "inline-info-popup";
  heading.textContent = title;
  copy.textContent = label;
  popup.append(heading, copy);

  let popupFrame = 0;
  const keepPopupInsideViewport = () => {
    window.cancelAnimationFrame(popupFrame);
    const startedAt = performance.now();

    const updatePosition = (now: number) => {
      if (!element.isConnected || !element.classList.contains("is-open")) {
        return;
      }

      popup.style.setProperty("--popup-shift-x", "0px");
      popup.style.setProperty("--popup-shift-y", "0px");
      const rect = popup.getBoundingClientRect();
      const safeGap = window.innerWidth <= 700 ? 12 : 18;
      let shiftX = 0;
      let shiftY = 0;

      if (rect.left < safeGap) shiftX = safeGap - rect.left;
      if (rect.right > window.innerWidth - safeGap) {
        shiftX = window.innerWidth - safeGap - rect.right;
      }
      if (rect.top < safeGap) shiftY = safeGap - rect.top;
      if (rect.bottom > window.innerHeight - safeGap) {
        shiftY = window.innerHeight - safeGap - rect.bottom;
      }

      popup.style.setProperty("--popup-shift-x", `${shiftX}px`);
      popup.style.setProperty("--popup-shift-y", `${shiftY}px`);

      if (now - startedAt < 900) {
        popupFrame = window.requestAnimationFrame(updatePosition);
      }
    };

    popupFrame = window.requestAnimationFrame(updatePosition);
  };

  element.dataset.popupSide = side;
  element.setAttribute("role", "button");
  element.setAttribute("aria-label", title);
  element.setAttribute("aria-expanded", "false");
  element.tabIndex = 0;
  element.append(icon, popup);

  const togglePopup = () => {
    const willOpen = !element.classList.contains("is-open");
    if (willOpen) args.focus?.();
    document.querySelectorAll(".inline-info-hotspot.is-open").forEach((item) => {
      item.classList.remove("is-open");
      item.setAttribute("aria-expanded", "false");
    });
    element.classList.toggle("is-open", willOpen);
    element.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) {
      keepPopupInsideViewport();
    } else {
      window.cancelAnimationFrame(popupFrame);
      popup.style.removeProperty("--popup-shift-x");
      popup.style.removeProperty("--popup-shift-y");
    }
  };

  element.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePopup();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      togglePopup();
    }
  });
};

export default function PannellumViewer({
  config,
  currentScene,
  onSceneChange,
  onInfoRequest,
}: PannellumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewerApi | null>(null);
  const coordinateReadoutRef = useRef<HTMLOutputElement>(null);
  const pitchValueRef = useRef<HTMLElement>(null);
  const yawValueRef = useRef<HTMLElement>(null);
  const activeSceneRef = useRef(currentScene);
  const requestedSceneRef = useRef(currentScene);
  const [phase, setPhase] = useState<ViewerPhase>("booting");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSceneChange = useCallback(
    (sceneId: string) => {
      activeSceneRef.current = sceneId;
      setPhase("switching");
      onSceneChange(sceneId);
    },
    [onSceneChange]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;

    const initialize = async () => {
      try {
        await import("pannellum");
        if (disposed) return;

        const viewerFactory = (
          window as typeof window & {
            pannellum?: { viewer: ViewerFactory };
          }
        ).pannellum?.viewer;

        if (!viewerFactory) {
          throw new Error("Factory Pannellum tidak tersedia di browser.");
        }

        const { fallbackPanorama, ...viewerDefaults } = config.default;
        const useMobilePanoramas =
          Math.min(window.innerWidth, window.innerHeight) <= 700;
        const scenes = Object.fromEntries(
          Object.entries(config.scenes).map(([sceneId, scene]) => [
            sceneId,
            {
              ...scene,
              panorama:
                scene.status === "ready"
                  ? useMobilePanoramas && scene.mobilePanorama
                    ? scene.mobilePanorama
                    : scene.panorama
                  : fallbackPanorama,
              hotSpots: scene.hotSpots.map((hotspot) => {
                const focusHotSpot = () => {
                  viewerRef.current?.lookAt(
                    hotspot.pitch,
                    hotspot.yaw,
                    60,
                    750
                  );
                };

                if (hotspot.variant === "door") {
                  return {
                    ...hotspot,
                    cssClass: "door-hotspot",
                    createTooltipFunc: createDoorHotSpot,
                    createTooltipArgs: hotspot.text,
                  };
                }

                if (hotspot.variant === "arrow") {
                  return {
                    ...hotspot,
                    cssClass: "arrow-hotspot",
                    createTooltipFunc: createArrowHotSpot,
                    createTooltipArgs: hotspot.text,
                  };
                }

                if (hotspot.variant === "label") {
                  return {
                    ...hotspot,
                    cssClass: "scene-label-hotspot",
                    createTooltipFunc: createSceneLabel,
                    createTooltipArgs: hotspot.text,
                  };
                }

                if (hotspot.variant === "inline-info") {
                  return {
                    ...hotspot,
                    cssClass: "inline-info-hotspot",
                    createTooltipFunc: createInlineInfoHotSpot,
                    createTooltipArgs: {
                      label: hotspot.text,
                      title: hotspot.popupTitle,
                      side: hotspot.popupSide,
                      focus: focusHotSpot,
                    },
                  };
                }

                return hotspot.type === "info"
                  ? {
                      ...hotspot,
                      clickHandlerFunc: (event: MouseEvent) => {
                        event.stopPropagation();
                        focusHotSpot();
                        onInfoRequest();
                      },
                    }
                  : hotspot;
              }),
            },
          ])
        );

        const requestedScene = requestedSceneRef.current;
        const initialScene = config.scenes[requestedScene]
          ? requestedScene
          : config.default.firstScene;
        const viewer = viewerFactory(container, {
          ...viewerDefaults,
          firstScene: initialScene,
          scenes,
          autoLoad: true,
          autoRotate: 0,
          compass: false,
          showControls: false,
          mouseZoom: true,
          keyboardZoom: true,
          friction: 0.15,
          escapeHTML: true,
        });

        viewer.on("load", () => {
          if (!disposed) setPhase("ready");
        });

        viewer.on("scenechange", (sceneId: unknown) => {
          if (!disposed && typeof sceneId === "string") {
            handleSceneChange(sceneId);
          }
        });

        viewer.on("error", (error: unknown) => {
          if (disposed) return;
          setErrorMessage(
            typeof error === "string"
              ? error
              : "Panorama tidak dapat dimuat pada perangkat ini."
          );
          setPhase("error");
        });

        viewerRef.current = viewer;
        activeSceneRef.current = initialScene;
      } catch (error) {
        if (disposed) return;
        console.error("Gagal menginisialisasi Pannellum:", error);
        setErrorMessage("Viewer 360° gagal disiapkan. Silakan muat ulang halaman.");
        setPhase("error");
      }
    };

    initialize();

    return () => {
      disposed = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (error) {
          console.warn("Gagal membersihkan viewer Pannellum:", error);
        }
        viewerRef.current = null;
      }
    };
  }, [config, handleSceneChange, onInfoRequest]);

  useEffect(() => {
    requestedSceneRef.current = currentScene;
    const viewer = viewerRef.current;
    if (!viewer || currentScene === activeSceneRef.current) return;

    setPhase("switching");
    viewer.loadScene(currentScene);
  }, [currentScene]);

  const changeZoom = (amount: number) => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const nextHfov = Math.min(120, Math.max(50, viewer.getHfov() + amount));
    viewer.setHfov(nextHfov);
  };

  const resetView = () => {
    const viewer = viewerRef.current;
    const scene = config.scenes[activeSceneRef.current];
    if (!viewer || !scene) return;

    viewer.lookAt(scene.pitch, scene.yaw, scene.hfov, 650);
  };

  const hideCursorCoordinates = () => {
    coordinateReadoutRef.current?.removeAttribute("data-visible");
  };

  const updateCursorCoordinates = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === "touch") {
      hideCursorCoordinates();
      return;
    }

    const viewer = viewerRef.current;
    const readout = coordinateReadoutRef.current;
    if (!viewer || !readout || phase !== "ready") return;

    const [pitch, yaw] = viewer.mouseEventToCoords(event.nativeEvent);
    if (!Number.isFinite(pitch) || !Number.isFinite(yaw)) return;

    const formatCoordinate = (value: number) =>
      (Math.abs(value) < 0.05 ? 0 : value).toFixed(1);
    if (pitchValueRef.current) {
      pitchValueRef.current.textContent = `${formatCoordinate(pitch)}°`;
    }
    if (yawValueRef.current) {
      yawValueRef.current.textContent = `${formatCoordinate(yaw)}°`;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const cursorX = event.clientX - bounds.left;
    const cursorY = event.clientY - bounds.top;
    const gap = 16;
    const edge = 12;
    const width = readout.offsetWidth;
    const height = readout.offsetHeight;
    let x = cursorX + gap;
    let y = cursorY + gap;

    if (x + width > bounds.width - edge) x = cursorX - width - gap;
    if (y + height > bounds.height - edge) y = cursorY - height - gap;
    x = Math.max(edge, Math.min(x, bounds.width - width - edge));
    y = Math.max(edge, Math.min(y, bounds.height - height - edge));

    readout.style.setProperty("--cursor-coordinate-x", `${x}px`);
    readout.style.setProperty("--cursor-coordinate-y", `${y}px`);
    readout.dataset.visible = "true";
  };

  return (
    <div className="panorama-viewer">
      <div
        ref={containerRef}
        className="panorama-canvas"
        onPointerMove={updateCursorCoordinates}
        onPointerLeave={hideCursorCoordinates}
      />

      <output
        ref={coordinateReadoutRef}
        className="cursor-coordinate-readout"
        aria-hidden="true"
      >
        <span>
          Pitch <strong ref={pitchValueRef}>0.0°</strong>
        </span>
        <span>
          Yaw <strong ref={yawValueRef}>0.0°</strong>
        </span>
      </output>

      {phase === "booting" && (
        <div className="viewer-intro" role="status" aria-live="polite">
          <span className="viewer-intro-orbit" aria-hidden="true">
            <i />
          </span>
          <strong>Menyiapkan ruang 360°</strong>
          <small>Geser layar untuk melihat sekeliling</small>
        </div>
      )}

      {phase === "error" && (
        <div className="viewer-error" role="alert">
          <span aria-hidden="true">!</span>
          <strong>Panorama belum dapat dibuka</strong>
          <p>{errorMessage}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Muat ulang
          </button>
        </div>
      )}

      <div className="viewer-controls" aria-label="Kontrol panorama">
        <button type="button" onClick={() => changeZoom(-10)} aria-label="Perbesar panorama">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button type="button" onClick={() => changeZoom(10)} aria-label="Perkecil panorama">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button type="button" onClick={resetView} aria-label="Kembalikan arah pandang awal">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 11a8 8 0 1 1 2 6M4 11V5m0 6h6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => viewerRef.current?.toggleFullscreen()}
          aria-label="Buka layar penuh"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
          </svg>
        </button>
      </div>

      <span className="sr-only" aria-live="polite">
        {phase === "switching" ? "Berpindah ruangan" : ""}
      </span>
    </div>
  );
}
