declare module "pannellum" {
  interface PannellumViewer {
    on: (event: string, handler: (...args: unknown[]) => void) => void;
    loadScene: (sceneId: string, pitch?: number, yaw?: number) => void;
    destroy: () => void;
    getScene: () => string;
    getHfov: () => number;
    setHfov: (hfov: number) => void;
    getPitch: () => number;
    setPitch: (pitch: number) => void;
    getYaw: () => number;
    setYaw: (yaw: number) => void;
    mouseEventToCoords: (event: MouseEvent) => [number, number];
    lookAt: (
      pitch: number,
      yaw: number,
      hfov?: number,
      animated?: number | boolean
    ) => void;
    toggleFullscreen: () => void;
  }

  interface PannellumConfig {
    type?: string;
    panorama?: string;
    hfov?: number;
    minHfov?: number;
    maxHfov?: number;
    pitch?: number;
    minPitch?: number;
    maxPitch?: number;
    yaw?: number;
    minYaw?: number;
    maxYaw?: number;
    autoLoad?: boolean;
    autoRotate?: number;
    compass?: boolean;
    escapeHTML?: boolean;
    showControls?: boolean;
    showZoomCtrl?: boolean;
    showFullscreenCtrl?: boolean;
    mouseZoom?: boolean;
    keyboardZoom?: boolean;
    friction?: number;
    firstScene?: string;
    sceneFadeDuration?: number;
    scenes?: Record<string, PannellumScene>;
    [key: string]: unknown;
  }

  interface PannellumScene {
    title?: string;
    hfov?: number;
    pitch?: number;
    yaw?: number;
    type?: string;
    panorama?: string;
    hotSpots?: PannellumHotSpot[];
    [key: string]: unknown;
  }

  interface PannellumHotSpot {
    pitch: number;
    yaw: number;
    type: string;
    text: string;
    sceneId?: string;
    URL?: string;
    targetPitch?: number | string;
    targetYaw?: number | string;
    targetHfov?: number | string;
    [key: string]: unknown;
  }

  function viewer(
    container: HTMLElement,
    config: PannellumConfig
  ): PannellumViewer;

  const pannellum: { viewer: typeof viewer };

  export { viewer, PannellumViewer, PannellumConfig, PannellumScene, PannellumHotSpot };
  export default pannellum;
}
