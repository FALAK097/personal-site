"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const BOOST_RATE = 2.1;
const BOOST_DURATION = 3600;
const FAREWELL_DURATION = 4000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function BoatWake() {
  return (
    <svg className="footer-boat-wake footer-water-motion" viewBox="0 0 140 32" fill="none" aria-hidden="true">
      <g className="footer-wake-ripples footer-water-motion">
        <path d="M138 16C104 14 70 7 2 2M138 16C103 19 68 26 2 30" />
        <path d="M130 16C96 13 49 13 12 8M130 17C92 20 49 19 10 25" opacity="0.55" />
      </g>
      <path className="footer-wake-foam footer-water-motion" d="M131 16h-8m-7 1h-9m-6-2h-10m-5 3H74m-6-2H55m-8 3H34m-6-4H15" />
    </svg>
  );
}

function WaterfrontImage() {
  return (
    <>
      <Image src="/images/mumbai-waterfront-day.webp" alt="" width={2172} height={724} sizes="(max-width: 960px) 960px, 100vw" className="footer-landscape footer-landscape-day" />
      <Image src="/images/mumbai-waterfront-night.webp" alt="" width={2172} height={724} sizes="(max-width: 960px) 960px, 100vw" className="footer-landscape footer-landscape-night" />
    </>
  );
}

export function FooterSeascape() {
  const sceneRef = useRef(null);
  const boatRef = useRef(null);
  const vesselRef = useRef(null);
  const animationsRef = useRef(null);
  const activeRef = useRef(false);
  const boostTimerRef = useRef(0);
  const farewellTimerRef = useRef(0);

  const [boosted, setBoosted] = useState(false);
  const [farewell, setFarewell] = useState(false);
  const [farewellKey, setFarewellKey] = useState(0);

  const applyMotionState = useCallback(() => {
    const animations = animationsRef.current;
    if (!animations) return;
    if (activeRef.current) {
      animations.travel.play();
      animations.flip.play();
    } else {
      animations.travel.pause();
      animations.flip.pause();
    }
  }, []);

  const cancelAnimations = useCallback(() => {
    const animations = animationsRef.current;
    if (!animations) return;
    animations.travel.cancel();
    animations.flip.cancel();
    animationsRef.current = null;
  }, []);

  // The boat is a ferry: it crosses the whole waterfront, slips out of view,
  // turns around where nobody can see the mirror, and comes back the other way.
  // A Web Animations loop (rather than a CSS one) lets the click boost change
  // playback rate without the jump that re-timing a CSS animation would cause.
  const createAnimations = useCallback(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      cancelAnimations();
      return;
    }

    const scene = sceneRef.current;
    const boat = boatRef.current;
    const vessel = vesselRef.current;
    if (!scene || !boat || !vessel) return;

    const sceneWidth = scene.clientWidth;
    const boatWidth = boat.offsetWidth;
    if (!sceneWidth || !boatWidth) return;

    const previous = animationsRef.current;
    const fraction = previous
      ? ((previous.travel.currentTime ?? 0) % previous.loopMs) / previous.loopMs
      : 0;
    const rate = previous ? previous.travel.playbackRate : 1;

    previous?.travel.cancel();
    previous?.flip.cancel();

    // ~14s per crossing at 1000px, clamped so phones and wide monitors both
    // read as a steady, unhurried sail.
    const crossingMs = Math.min(18000, Math.max(11000, sceneWidth * 14));
    const loopMs = crossingMs * 2;
    const offLeft = -boatWidth * 1.05;
    const offRight = sceneWidth + boatWidth * 0.2;

    const travelKeyframes = [
      { offset: 0, transform: `translateX(${offLeft}px)` },
      { offset: 0.04, transform: `translateX(${offLeft}px)` },
      { offset: 0.5, transform: `translateX(${offRight}px)` },
      { offset: 0.54, transform: `translateX(${offRight}px)` },
      { offset: 1, transform: `translateX(${offLeft}px)` },
    ];
    // The mirror flip is parked fully off the right edge (offsets 0.5–0.54);
    // the reset back to east happens off the left edge on loop wrap.
    const flipKeyframes = [
      { offset: 0, transform: "scaleX(1)" },
      { offset: 0.5, transform: "scaleX(1)" },
      { offset: 0.54, transform: "scaleX(-1)" },
      { offset: 1, transform: "scaleX(-1)" },
    ];

    const travel = boat.animate(travelKeyframes, { duration: loopMs, iterations: Infinity, easing: "linear" });
    const flip = vessel.animate(flipKeyframes, { duration: loopMs, iterations: Infinity, easing: "linear" });

    travel.currentTime = fraction * loopMs;
    flip.currentTime = fraction * loopMs;
    travel.playbackRate = rate;
    flip.playbackRate = rate;

    animationsRef.current = { travel, flip, loopMs };
  }, [cancelAnimations]);

  // Pause the whole scene while it is off-screen or the tab is hidden.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let inView = false;
    const update = () => {
      const active = inView && !document.hidden;
      scene.dataset.active = String(active);
      activeRef.current = active;
      applyMotionState();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(scene);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [applyMotionState]);

  // Build the loop, and rebuild when the scene resizes or motion preferences
  // change so the boat keeps its progress instead of restarting.
  useEffect(() => {
    createAnimations();
    applyMotionState();

    const scene = sceneRef.current;
    if (!scene) return;

    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleMotionPreference = () => {
      createAnimations();
      applyMotionState();
    };
    motionQuery.addEventListener("change", handleMotionPreference);

    let frame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        createAnimations();
        applyMotionState();
      });
    });
    resizeObserver.observe(scene);

    return () => {
      motionQuery.removeEventListener("change", handleMotionPreference);
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimations();
    };
  }, [applyMotionState, cancelAnimations, createAnimations]);

  useEffect(
    () => () => {
      window.clearTimeout(boostTimerRef.current);
      window.clearTimeout(farewellTimerRef.current);
    },
    [],
  );

  const handleBoost = () => {
    setFarewell(true);
    setFarewellKey((key) => key + 1);
    window.clearTimeout(farewellTimerRef.current);
    farewellTimerRef.current = window.setTimeout(() => setFarewell(false), FAREWELL_DURATION);

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const animations = animationsRef.current;
    if (!animations) return;

    const setRate = (rate) => {
      if (typeof animations.travel.updatePlaybackRate === "function") {
        animations.travel.updatePlaybackRate(rate);
        animations.flip.updatePlaybackRate(rate);
      } else {
        animations.travel.playbackRate = rate;
        animations.flip.playbackRate = rate;
      }
    };

    setBoosted(true);
    setRate(BOOST_RATE);

    window.clearTimeout(boostTimerRef.current);
    boostTimerRef.current = window.setTimeout(() => {
      setBoosted(false);
      const current = animationsRef.current;
      if (!current) return;
      if (typeof current.travel.updatePlaybackRate === "function") {
        current.travel.updatePlaybackRate(1);
        current.flip.updatePlaybackRate(1);
      } else {
        current.travel.playbackRate = 1;
        current.flip.playbackRate = 1;
      }
    }, BOOST_DURATION);
  };

  return (
    <div ref={sceneRef} className="footer-seascape" data-active="false" data-boost={boosted ? "true" : "false"}>
      <span className="sr-only" role="status">
        {farewell ? "Bon voyage! The boat is speeding up." : ""}
      </span>
      <div className="footer-scene">
        <WaterfrontImage />
        <div className="footer-water" aria-hidden="true">
          <div className="footer-water-drift footer-water-motion"><WaterfrontImage /></div>
          <div className="footer-water-glints footer-water-motion" />
        </div>
        <div className="footer-boat-course">
          <button
            ref={boatRef}
            type="button"
            className="footer-boat"
            aria-label="Speed up the boat"
            title="Speed up the boat"
            onClick={handleBoost}
          >
            {farewell ? (
              <span key={farewellKey} className="footer-bon-voyage" aria-hidden="true">Bon voyage!</span>
            ) : null}
            <span ref={vesselRef} className="footer-vessel-direction">
              <span className="footer-vessel footer-water-motion">
                <Image className="footer-vessel-image" src="/images/mumbai-yacht.svg" alt="" width={480} height={220} sizes="120px" unoptimized />
                <Image className="footer-vessel-reflection" src="/images/mumbai-yacht.svg" alt="" width={480} height={220} sizes="120px" aria-hidden="true" unoptimized />
              </span>
              <BoatWake />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
