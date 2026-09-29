export interface HotSpot {
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  text: string;
  sceneId?: string;
  URL?: string;
  targetPitch?: number | "same";
  targetYaw?: number | "same" | "sameAzimuth";
  targetHfov?: number | "same";
  variant?: "door" | "arrow" | "inline-info" | "label";
  gateway?: boolean;
  popupTitle?: string;
  popupSide?: "left" | "right";
  [key: string]: unknown;
}

export interface Scene {
  title: string;
  status: "ready" | "preview";
  hfov: number;
  pitch: number;
  yaw: number;
  type: "equirectangular";
  panorama: string;
  mobilePanorama?: string;
  hotSpots: HotSpot[];
  [key: string]: unknown;
}

export interface TourConfig {
  default: {
    firstScene: string;
    sceneFadeDuration: number;
    author?: string;
    fallbackPanorama: string;
  };
  scenes: Record<string, Scene>;
}

export const tourData: TourConfig = {
  default: {
    firstScene: "lobby",
    sceneFadeDuration: 1000,
    author: "Kominfo",
    fallbackPanorama: "/images/panoramas/lobby.png",
  },
  scenes: {
    lobby: {
      title: "Lobi Utama",
      status: "ready",
      hfov: 100,
      pitch: -15,
      yaw: 12,
      type: "equirectangular",
      panorama: "/images/panoramas/lobby.png",
      hotSpots: [
        {
          pitch: -42,
          yaw: 26,
          type: "scene",
          text: "Perpustakaan",
          sceneId: "entrance",
          targetPitch: 0,
          targetYaw: 0,
          variant: "door",
        },
        {
          pitch: -24,
          yaw: -7,
          type: "scene",
          text: "Kominfo",
          sceneId: "kominfo_data_center",
          targetPitch: 0,
          targetYaw: 0,
          variant: "door",
        },
      ],
    },
    kominfo_data_center: {
      title: "Kominfo · Data Center",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/kominfo-data-center.jpeg",
      mobilePanorama: "/images/panoramas/mobile/kominfo-data-center.jpeg",
      hotSpots: [
        {
          pitch: -7,
          yaw: -2,
          type: "info",
          text: "Lantai 5",
          variant: "label",
        },
        {
          pitch: -4,
          yaw: -142,
          type: "info",
          text: "Pintu ini merupakan akses menuju Ruang Data Center.",
          popupTitle: "Ruang Data Center",
          popupSide: "right",
          variant: "inline-info",
        },
        {
          pitch: -17,
          yaw: 164,
          type: "scene",
          text: "Kominfo · Sekretariat",
          sceneId: "kominfo_secretariat",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
        {
          pitch: -19.3,
          yaw: -163.1,
          type: "scene",
          text: "Kominfo · Koridor IKP",
          sceneId: "kominfo_exit_ikp",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
      ],
    },
    kominfo_exit_ikp: {
      title: "Kominfo · Koridor IKP",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/kominfo-keluar-ikp.jpeg",
      mobilePanorama: "/images/panoramas/mobile/kominfo-keluar-ikp.jpeg",
      hotSpots: [
        {
          pitch: -21.8,
          yaw: -74.2,
          type: "scene",
          text: "Kominfo · Data Center",
          sceneId: "kominfo_data_center",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
        {
          pitch: -24,
          yaw: -92,
          type: "scene",
          text: "Kominfo · Persandian & Aptika",
          sceneId: "kominfo_persandian_aptika",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
        {
          pitch: -11.5,
          yaw: 91.6,
          type: "scene",
          text: "Kominfo · IKP",
          sceneId: "kominfo_ikp",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
      ],
    },
    kominfo_ikp: {
      title: "Kominfo · IKP",
      status: "preview",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/kominfo-ikp.jpeg",
      hotSpots: [],
    },
    kominfo_persandian_aptika: {
      title: "Kominfo · Persandian & Aptika",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/kominfo-persandian-aptika.jpeg",
      mobilePanorama: "/images/panoramas/mobile/kominfo-persandian-aptika.jpeg",
      hotSpots: [
        {
          pitch: -6,
          yaw: -14,
          type: "info",
          text: "Pintu ini merupakan akses menuju Ruang Persandian.",
          popupTitle: "Ruang Persandian",
          popupSide: "left",
          variant: "inline-info",
        },
        {
          pitch: -6,
          yaw: 4,
          type: "info",
          text: "Pintu ini merupakan akses menuju Ruang Aptika/TIK.",
          popupTitle: "Ruang Aptika/TIK",
          popupSide: "right",
          variant: "inline-info",
        },
        {
          pitch: -19.1,
          yaw: -146.6,
          type: "scene",
          text: "Kominfo · Sekretariat",
          sceneId: "kominfo_secretariat",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
      ],
    },
    kominfo_secretariat: {
      title: "Kominfo · Sekretariat",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/kominfo-sekretariat.jpeg",
      mobilePanorama: "/images/panoramas/mobile/kominfo-sekretariat.jpeg",
      hotSpots: [
        {
          pitch: -22.9,
          yaw: 91.0,
          type: "scene",
          text: "Kominfo · Data Center",
          sceneId: "kominfo_data_center",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
        {
          pitch: -17,
          yaw: -96,
          type: "scene",
          text: "Kominfo · Persandian & Aptika",
          sceneId: "kominfo_persandian_aptika",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
      ],
    },
    reading_room: {
      title: "Pintu Masuk Pertama",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/pintu-masuk-pertama.jpeg",
      mobilePanorama: "/images/panoramas/mobile/pintu-masuk-pertama.jpeg",
      hotSpots: [
        {
          pitch: -15,
          yaw: 28,
          type: "scene",
          text: "Ruang Resepsionis",
          sceneId: "computer_area",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
          gateway: true,
        },
        {
          pitch: -7.0,
          yaw: -95.1,
          type: "info",
          text: "Pengunjung dapat menggunakan loker ini untuk menyimpan tas dan barang bawaan sebelum memasuki area perpustakaan.",
          popupTitle: "Loker pengunjung",
          popupSide: "right",
          variant: "inline-info",
        },
        {
          pitch: -5,
          yaw: 158,
          type: "scene",
          text: "Depan Perpustakaan",
          sceneId: "entrance",
          targetPitch: 0,
          targetYaw: 0,
          variant: "door",
        },
      ],
    },
    computer_area: {
      title: "Ruang Resepsionis",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/ruang-resepsionis-edit-card.jpeg",
      mobilePanorama: "/images/panoramas/mobile/ruang-resepsionis-edit-card.jpeg",
      hotSpots: [
        {
          pitch: -5,
          yaw: -24,
          type: "info",
          text: "Buat e-card pengunjung terlebih dahulu di meja resepsionis sebelum masuk ke area perpustakaan.",
          popupTitle: "Pendaftaran e-card",
          popupSide: "right",
          variant: "inline-info",
        },
        {
          pitch: -3,
          yaw: 35.5,
          type: "info",
          text: "Lengkapi data diri terlebih dahulu melalui laptop pendaftaran yang berada di tengah.",
          popupTitle: "Isi data diri",
          popupSide: "left",
          variant: "inline-info",
        },
        {
          pitch: -4,
          yaw: 14,
          type: "scene",
          text: "Pintu Masuk Kedua",
          sceneId: "library_second_entrance",
          targetPitch: 0,
          targetYaw: 0,
          variant: "door",
        },
        {
          pitch: -7,
          yaw: 180,
          type: "scene",
          text: "Pintu Masuk Pertama",
          sceneId: "reading_room",
          targetPitch: 0,
          targetYaw: 0,
          variant: "arrow",
        },
      ],
    },
    library_second_entrance: {
      title: "Pintu Masuk Kedua",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 180,
      type: "equirectangular",
      panorama: "/images/panoramas/ruang-pintu-kedua.jpeg",
      mobilePanorama: "/images/panoramas/mobile/ruang-pintu-kedua.jpeg",
      hotSpots: [
        {
          pitch: -4,
          yaw: -9,
          type: "scene",
          text: "Ruang Resepsionis",
          sceneId: "computer_area",
          targetPitch: 0,
          targetYaw: 0,
          variant: "door",
        },
      ],
    },
    discussion_room: {
      title: "Ruang Diskusi",
      status: "preview",
      hfov: 110,
      pitch: 0,
      yaw: 60,
      type: "equirectangular",
      panorama: "/images/panoramas/discussion_room.jpg",
      hotSpots: [
        {
          pitch: 0,
          yaw: -120,
          type: "scene",
          text: "Kembali ke Ruang Baca",
          sceneId: "reading_room",
          targetPitch: -3,
          targetYaw: -45,
        },
        {
          pitch: -3,
          yaw: 90,
          type: "scene",
          text: "Menuju Ruang Rapat",
          sceneId: "meeting_room",
          targetPitch: 0,
          targetYaw: 0,
        },
        {
          pitch: 10,
          yaw: 45,
          type: "info",
          text: "Digunakan untuk diskusi kelompok.",
        },
      ],
    },
    printing_area: {
      title: "Area Cetak",
      status: "preview",
      hfov: 110,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/printing_area.jpg",
      hotSpots: [
        {
          pitch: 0,
          yaw: 180,
          type: "scene",
          text: "Kembali ke Area Komputer",
          sceneId: "computer_area",
          targetPitch: -2,
          targetYaw: 120,
        },
        {
          pitch: -3,
          yaw: -60,
          type: "scene",
          text: "Menuju Ruang Arsip",
          sceneId: "archive_room",
          targetPitch: 0,
          targetYaw: 45,
        },
        {
          pitch: 8,
          yaw: 0,
          type: "info",
          text: "Tersedia printer, pemindai, dan mesin fotokopi.",
        },
      ],
    },
    meeting_room: {
      title: "Ruang Rapat",
      status: "preview",
      hfov: 110,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/meeting_room.jpg",
      hotSpots: [
        {
          pitch: 0,
          yaw: 180,
          type: "scene",
          text: "Kembali ke Ruang Diskusi",
          sceneId: "discussion_room",
          targetPitch: -3,
          targetYaw: 90,
        },
        {
          pitch: 5,
          yaw: 0,
          type: "info",
          text: "Kapasitas 20 orang dan dilengkapi proyektor.",
        },
      ],
    },
    archive_room: {
      title: "Ruang Arsip",
      status: "preview",
      hfov: 110,
      pitch: 0,
      yaw: 45,
      type: "equirectangular",
      panorama: "/images/panoramas/archive_room.jpg",
      hotSpots: [
        {
          pitch: 0,
          yaw: -135,
          type: "scene",
          text: "Kembali ke Area Cetak",
          sceneId: "printing_area",
          targetPitch: -3,
          targetYaw: -60,
        },
        {
          pitch: 8,
          yaw: 30,
          type: "info",
          text: "Menyimpan dokumen dan arsip perpustakaan.",
        },
      ],
    },
    entrance: {
      title: "Depan Perpustakaan",
      status: "ready",
      hfov: 100,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/depan-perpustakaan.jpeg",
      mobilePanorama: "/images/panoramas/mobile/depan-perpustakaan.jpeg",
      hotSpots: [
        {
          pitch: 2.5,
          yaw: -1.2,
          type: "scene",
          text: "Pintu Masuk",
          sceneId: "reading_room",
          targetPitch: 0,
          targetYaw: 0,
          variant: "door",
        },
      ],
    },
    children_section: {
      title: "Area Anak",
      status: "preview",
      hfov: 110,
      pitch: 0,
      yaw: 30,
      type: "equirectangular",
      panorama: "/images/panoramas/children_section.jpg",
      hotSpots: [
        {
          pitch: 0,
          yaw: -150,
          type: "scene",
          text: "Kembali ke Ruang Baca",
          sceneId: "reading_room",
          targetPitch: 2,
          targetYaw: 45,
        },
        {
          pitch: 8,
          yaw: 0,
          type: "info",
          text: "Berisi buku cerita dan permainan edukatif.",
        },
      ],
    },
    digital_library: {
      title: "Perpustakaan Digital",
      status: "preview",
      hfov: 110,
      pitch: 0,
      yaw: 60,
      type: "equirectangular",
      panorama: "/images/panoramas/digital_library.jpg",
      hotSpots: [
        {
          pitch: 0,
          yaw: -120,
          type: "scene",
          text: "Kembali ke Area Komputer",
          sceneId: "computer_area",
          targetPitch: 0,
          targetYaw: 90,
        },
        {
          pitch: 8,
          yaw: 45,
          type: "info",
          text: "Menyediakan akses e-book dan database daring.",
        },
      ],
    },
    garden: {
      title: "Taman Baca",
      status: "preview",
      hfov: 110,
      pitch: -10,
      yaw: 0,
      type: "equirectangular",
      panorama: "/images/panoramas/garden.jpg",
      hotSpots: [
        {
          pitch: 0,
          yaw: 180,
          type: "scene",
          text: "Kembali ke Lobi",
          sceneId: "lobby",
          targetPitch: -3,
          targetYaw: 0,
        },
        {
          pitch: 5,
          yaw: 30,
          type: "info",
          text: "Area baca di luar ruangan.",
        },
      ],
    },
  },
};

export const getSceneList = () => {
  return Object.entries(tourData.scenes)
    .filter(([, scene]) => scene.status === "ready")
    .map(([id, scene]) => ({
      id,
      title: scene.title,
      status: scene.status,
      panorama: scene.panorama,
    }));
};
