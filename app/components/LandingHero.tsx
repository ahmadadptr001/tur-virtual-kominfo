"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const CONTENT_REVEAL_LEAD_SECONDS = 10;
const CONTENT_REVEAL_FALLBACK_MS = 10_000;

export default function LandingHero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRevealedRef = useRef(false);
  const revealRequestedRef = useRef(false);
  const revealContentRef = useRef<(() => void) | null>(null);

  const revealHeroContent = useCallback(() => {
    revealRequestedRef.current = true;
    if (contentRevealedRef.current || !revealContentRef.current) return;
    contentRevealedRef.current = true;
    revealContentRef.current();
  }, []);

  useLayoutEffect(() => {
    let revealFallback = 0;
    const context = gsap.context(() => {
      const revealTargets = [
        ".hero-brand",
        ".hero-copy > *",
        ".hero-coordinate",
      ];
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.set(revealTargets, { opacity: 0 });
      gsap.set(".hero-brand", { y: -18 });
      gsap.set(".hero-copy > *", { y: 34 });
      gsap.fromTo(
        ".hero-video",
        { opacity: 0 },
        { opacity: 1, duration: reduceMotion ? 0.01 : 1.2, ease: "power1.out" }
      );

      if (reduceMotion) {
        revealContentRef.current = () => {
          gsap.set(revealTargets, { opacity: 1, y: 0 });
        };
        revealHeroContent();
        videoRef.current?.pause();
        return;
      }

      const revealTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      revealTimeline
        .to(".hero-brand", { y: 0, opacity: 1, duration: 1.8 }, 0)
        .to(
          ".hero-copy > *",
          { y: 0, opacity: 1, duration: 2, stagger: 0.42 },
          0.55
        )
        .to(".hero-coordinate", { opacity: 1, duration: 1.6 }, 2.35);

      revealContentRef.current = () => revealTimeline.play();
      if (revealRequestedRef.current) revealHeroContent();
      revealFallback = window.setTimeout(
        revealHeroContent,
        CONTENT_REVEAL_FALLBACK_MS
      );

      const playback = videoRef.current?.play();
      playback?.catch(revealHeroContent);
    }, heroRef);

    return () => {
      window.clearTimeout(revealFallback);
      contentRevealedRef.current = false;
      revealRequestedRef.current = false;
      revealContentRef.current = null;
      context.revert();
    };
  }, [revealHeroContent]);

  const handleVideoProgress = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    if (
      video.currentTime >=
      Math.max(0, video.duration - CONTENT_REVEAL_LEAD_SECONDS)
    ) {
      revealHeroContent();
    }
  };

  return (
    <main className="landing-page">
      <section ref={heroRef} className="landing-hero" aria-labelledby="hero-title">
        <div className="hero-camera-wrap">
          <div className="hero-camera">
            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleVideoProgress}
              onTimeUpdate={handleVideoProgress}
              onEnded={revealHeroContent}
              onError={revealHeroContent}
              aria-hidden="true"
            >
              <source src="/videos/background-movie.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-vignette" aria-hidden="true" />
          <div className="hero-noise" aria-hidden="true" />
        </div>

        <header className="hero-header hero-brand">
          <Link href="/" className="brand-lockup" aria-label="Beranda tur virtual">
            <span className="brand-mark" aria-hidden="true">
              <Image
                src="/images/logo-sulawesi-tenggara.svg"
                alt=""
                width={38}
                height={38}
                priority
              />
            </span>
            <span>
              <strong>Perpustakaan Kominfo</strong>
            </span>
          </Link>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-eyebrow">Tur virtual · Sulawesi Tenggara</p>
            <h1 id="hero-title">
              Kenali ruangnya.
              <span>Datang lebih siap.</span>
            </h1>
            <p>
              Ikuti alur kunjungan dari depan gedung hingga meja layanan
              melalui sembilan panorama nyata.
            </p>
            <div className="hero-actions">
              <Link href="/tour" className="hero-primary-action">
                Mulai jelajahi
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-coordinate" aria-hidden="true">
          <span>01</span>
          <span>Lobi utama</span>
          <span>00° / 360°</span>
        </div>
      </section>
    </main>
  );
}
