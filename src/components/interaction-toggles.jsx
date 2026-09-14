"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { useWebHaptics } from "web-haptics/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const soundPreferenceEvent = "portfolio-sound-change";
const getSoundPreference = () => localStorage.getItem("portfolio-sound") !== "false";
const getServerSoundPreference = () => true;
const subscribeToSoundPreference = (callback) => {
  window.addEventListener("storage", callback);
  window.addEventListener(soundPreferenceEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(soundPreferenceEvent, callback);
  };
};

export function InteractionToggles() {
  const soundEnabled = useSyncExternalStore(subscribeToSoundPreference, getSoundPreference, getServerSoundPreference);
  const { trigger } = useWebHaptics();

  useEffect(() => {
    const handleInteraction = (event) => {
      const target = event.target.closest("a,button,[role='button']");
      if (!target) return;

      trigger(8, { intensity: 0.5 });
      if (!soundEnabled || target.dataset.soundToggle === "true") return;

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
  }, [soundEnabled, trigger]);

  const toggleSound = () => {
    const next = !soundEnabled;
    localStorage.setItem("portfolio-sound", String(next));
    window.dispatchEvent(new Event(soundPreferenceEvent));
    trigger(10, { intensity: 0.6 });
    if (next) playTone(700);
  };

  const label = soundEnabled ? "Disable sounds" : "Enable sounds";

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-sound-toggle="true"
            aria-label={label}
            aria-pressed={soundEnabled}
            onClick={toggleSound}
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground [&_svg]:size-3.5 [&_svg]:stroke-[1.75]"
          >
            {soundEnabled ? <Volume2 /> : <VolumeX />}
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
