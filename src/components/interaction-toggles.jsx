"use client";

import { Volume2, VolumeX, Vibrate, VibrateOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function usePersistedToggle(key) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(localStorage.getItem(key) === "true"), [key]);
  const toggle = () => setEnabled((current) => { const next = !current; localStorage.setItem(key, String(next)); return next; });
  return [enabled, toggle];
}

export function InteractionToggles() {
  const [sound, toggleSound] = usePersistedToggle("portfolio-sound");
  const [haptics, toggleHaptics] = usePersistedToggle("portfolio-haptics");

  useEffect(() => {
    const interact = (event) => {
      if (!event.target.closest("a,button,[role='button']")) return;
      if (haptics) navigator.vibrate?.(8);
      if (sound) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return;
        const context = new Context();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = 440;
        gain.gain.setValueAtTime(0.018, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.035);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.04);
        oscillator.addEventListener("ended", () => context.close(), { once: true });
      }
    };
    document.addEventListener("pointerdown", interact, { passive: true });
    return () => document.removeEventListener("pointerdown", interact);
  }, [haptics, sound]);

  const preview = (kind) => {
    if (kind === "sound" && !sound) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (Context) { const context = new Context(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 520; gain.gain.setValueAtTime(0.025, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.045); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.05); oscillator.addEventListener("ended", () => context.close(), { once: true }); }
    }
    if (kind === "haptics" && !haptics) navigator.vibrate?.(10);
  };

  return <TooltipProvider delayDuration={300}><div className="flex items-center">
    <Toggle label={`${sound ? "Disable" : "Enable"} sound`} onClick={() => { preview("sound"); toggleSound(); }}>{sound ? <Volume2 /> : <VolumeX />}</Toggle>
    <Toggle label={`${haptics ? "Disable" : "Enable"} haptics`} onClick={() => { preview("haptics"); toggleHaptics(); }}>{haptics ? <Vibrate /> : <VibrateOff />}</Toggle>
  </div></TooltipProvider>;
}

function Toggle({ label, onClick, children }) {
  return <Tooltip><TooltipTrigger asChild><button type="button" aria-label={label} onClick={onClick} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground [&_svg]:size-3.5 [&_svg]:stroke-[1.75]">{children}</button></TooltipTrigger><TooltipContent sideOffset={8}>{label}</TooltipContent></Tooltip>;
}
