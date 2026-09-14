"use client";

import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";

function playTone(frequency = 520) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.025, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.045);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.05);
  oscillator.addEventListener("ended", () => context.close(), { once: true });
}

export function InteractionToggles() {
  const { trigger } = useWebHaptics();

  useEffect(() => {
    const handleInteraction = (event) => {
      const target = event.target.closest("a,button,[role='button']");
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

    document.addEventListener("pointerdown", handleInteraction, { passive: true });
    return () => document.removeEventListener("pointerdown", handleInteraction);
  }, [trigger]);

  return null;
}
