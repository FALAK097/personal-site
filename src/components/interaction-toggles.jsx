"use client";

import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";

const INTERACTIVE_SELECTOR = "a,button,[role='button']";

// One shared context: hovering fires far more often than clicking, and browsers
// cap how many AudioContexts a page may create.
let audioContext = null;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => undefined);
  return audioContext;
}

function playTone(frequency = 520, { gain = 0.025, duration = 0.05 } = {}) {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(gain, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0004, context.currentTime + duration);
  oscillator.connect(gainNode).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  oscillator.addEventListener(
    "ended",
    () => {
      try {
        gainNode.disconnect();
      } catch {
        // already torn down
      }
    },
    { once: true },
  );
}

export function InteractionToggles() {
  const { trigger } = useWebHaptics();

  useEffect(() => {
    let lastHovered = null;

    const handlePointerDown = (event) => {
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;

      trigger(8, { intensity: 0.5 });

      const themeSound = target.dataset.themeSound;
      if (themeSound) {
        const audio = new Audio(themeSound);
        audio.volume = 0.16;
        audio.play().catch(() => playTone(620));
        return;
      }
      playTone(440);
    };

    // A whisper-quiet tick as the pointer lands on a new interactive element —
    // only fires when the resolved element actually changes.
    const handlePointerOver = (event) => {
      if (event.pointerType !== "mouse") return;

      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (!target) {
        lastHovered = null;
        return;
      }
      if (target === lastHovered) return;

      lastHovered = target;
      playTone(1180, { gain: 0.006, duration: 0.018 });
    };

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerover", handlePointerOver);
    };
  }, [trigger]);

  return null;
}
