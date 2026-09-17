"use client";

import Image from "next/image";
import { useState } from "react";

function PaperBoat({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" aria-hidden="true">
      <path d="m4 19 16-6 6-11 5 14 13 3-9 10H13L4 19Z" fill="var(--boat-paper)" />
      <path d="m4 19 21 4 19-4-9 10H13L4 19Z" fill="var(--boat-fold)" />
      <path d="m4 19 21 4 19-4M20 13l5 10 1-21M4 19l16-6 6-11 5 14 13 3-9 10H13L4 19Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function FooterSeascape() {
  const [sailing, setSailing] = useState(false);
  const [hasSailed, setHasSailed] = useState(false);

  return (
    <div className="footer-seascape">
      <span className="sr-only" role="status">
        {sailing ? "Your paper boat is sailing across the waterfront." : hasSailed ? "Your boat has reached the other shore." : ""}
      </span>
      <div className="footer-scene">
        <Image
          src="/images/mumbai-waterfront.webp"
          alt=""
          width={2172}
          height={724}
          sizes="(max-width: 960px) 960px, 100vw"
          className="footer-landscape"
        />
        <div className="footer-boat-course">
          <button
            type="button"
            className={`footer-paper-boat${sailing ? " is-sailing" : ""}`}
            aria-label="Send the paper boat across the water"
            title="Send the paper boat across the water"
            aria-disabled={sailing}
            onClick={() => {
              if (!sailing) setSailing(true);
            }}
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget) return;
              setSailing(false);
              setHasSailed(true);
            }}
          >
            <PaperBoat />
            <span className="footer-boat-wake" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
