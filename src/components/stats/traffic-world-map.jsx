"use client";

import { Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps/core";
import world from "world-atlas/countries-110m.json";
import { countryFlag, formatExact } from "@/lib/traffic-formatters";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const LIGHT_MAP_FILLS = ["#e9eef5", "#bfdbfe", "#7cb4fc", "#3b82f6", "#1d63dc", "#113a84"];
const DARK_MAP_FILLS = ["#1f242d", "#163052", "#1c4980", "#2569b8", "#3b8ef3", "#70c5ff"];

const GEO_ALIASES = {
  bolivia: "BO",
  "bosnia and herz": "BA",
  brunei: "BN",
  "central african rep": "CF",
  // world-atlas 110m uses names that differ from English CLDR labels; these
  // atlas names resolve unambiguously to a single ISO-2 code ("Dem. Rep.
  // Congo" is aliased separately, preserving the two-Congo distinction).
  congo: "CG",
  "cote d ivoire": "CI",
  czechia: "CZ",
  "dem rep congo": "CD",
  "dominican rep": "DO",
  "eq guinea": "GQ",
  eswatini: "SZ",
  "falkland is": "FK",
  "fr s antarctic lands": "TF",
  iran: "IR",
  laos: "LA",
  macedonia: "MK",
  moldova: "MD",
  myanmar: "MM",
  "n cyprus": "CY",
  "north korea": "KP",
  palestine: "PS",
  russia: "RU",
  "s korea": "KR",
  "s sudan": "SS",
  "solomon is": "SB",
  somaliland: "SO",
  "south korea": "KR",
  syria: "SY",
  taiwan: "TW",
  tanzania: "TZ",
  "the bahamas": "BS",
  "trinidad and tobago": "TT",
  turkey: "TR",
  "united states of america": "US",
  venezuela: "VE",
  vietnam: "VN",
  "w sahara": "EH",
};

function normalizeGeoName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

const COUNTRY_CODE_BY_NAME = (() => {
  const names = new Map(Object.entries(GEO_ALIASES).map(([k, v]) => [normalizeGeoName(k), v]));
  for (let first = 65; first <= 90; first += 1) {
    for (let second = 65; second <= 90; second += 1) {
      const code = String.fromCharCode(first, second);
      try {
        const name = regionNames.of(code);
        if (name && name !== code && name !== "Unknown Region") {
          names.set(normalizeGeoName(name), code);
        }
      } catch {
        // ignore invalid ISO pair
      }
    }
  }
  return names;
})();

function fillForValue(value, max, palette) {
  if (!value || !max) return palette[0];
  const ratio = Math.sqrt(Math.min(value / max, 1));
  const steps = palette.length - 1;
  const level = Math.min(steps, Math.max(1, Math.ceil(ratio * steps)));
  return palette[level];
}

function metricValueOf(row, metric) {
  if (!row) return 0;
  return (metric === "visitors" ? row.visitors : row.pageviews) || 0;
}

function MapScaleLegend({ palette, max }) {
  return (
    <div
      className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-sm"
      aria-hidden="true"
    >
      <span>0</span>
      <div className="flex items-center gap-0.5">
        {palette.map((swatch) => (
          <span
            key={swatch}
            className="size-2 rounded-[2px] ring-1 ring-foreground/8"
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>
      <span className="tabular-nums">{formatExact(max)}</span>
    </div>
  );
}

function MapTooltip({ active, metric, total }) {
  if (!active) return null;
  const activeValue = metric === "visitors" ? active.visitors : active.pageviews;
  const share = total > 0 && activeValue > 0 ? ((activeValue / total) * 100).toFixed(1) : null;
  const flag = countryFlag(active.code);

  return (
    <div
      className="pointer-events-none absolute z-30 min-w-42 -translate-x-1/2 animate-in fade-in-0 zoom-in-95 rounded-lg border border-white/12 bg-[#141418]/95 px-3 py-2 text-xs text-[#fafafa] shadow-xl backdrop-blur-md duration-100"
      style={{ left: `${active.x}px`, top: `${active.y}px` }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-3 border-b border-white/10 pb-1 font-medium">
        <span className="flex items-center gap-1.5 truncate">
          {flag ? <span aria-hidden="true">{flag}</span> : null}
          <span className="truncate">{active.name}</span>
        </span>
        {share ? (
          <span className="font-mono text-[10px] text-white/60 tabular-nums">{share}%</span>
        ) : null}
      </div>
      <div className="space-y-1 font-mono text-[11px]">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="size-2 rounded-full bg-[#3b8ef3]" />
            Requests
          </span>
          <span className="font-medium tabular-nums">{formatExact(active.pageviews)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="size-2 rounded-full bg-[#2dd4bf]" />
            Visits
          </span>
          <span className="font-medium tabular-nums">{formatExact(active.visitors)}</span>
        </div>
      </div>
    </div>
  );
}

function resolvePointerTooltip(event, wrapNode, byCode) {
  const target = event.target.closest?.("[data-map-code]");
  if (!target || !wrapNode) return null;

  const code = target.getAttribute("data-map-code") || "";
  const name = target.getAttribute("data-map-name") || "Unknown";
  const row = byCode.get(code);
  const rect = wrapNode.getBoundingClientRect();
  const pointerX = "clientX" in event ? event.clientX - rect.left : rect.width / 2;
  const pointerY = "clientY" in event ? event.clientY - rect.top : rect.height / 2;

  return {
    code,
    name,
    pageviews: row?.pageviews ?? 0,
    visitors: row?.visitors ?? 0,
    x: Math.min(Math.max(pointerX, 92), Math.max(rect.width - 92, 92)),
    y: Math.min(Math.max(pointerY + 18, 12), Math.max(rect.height - 86, 12)),
  };
}

export function TrafficWorldMap({ countries = [], metric = "pageviews", total = 0 }) {
  const wrapRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState(null);

  // Loaded with ssr: false via next/dynamic, so resolvedTheme is available on client mount
  const isDark = resolvedTheme === "dark";
  const palette = isDark ? DARK_MAP_FILLS : LIGHT_MAP_FILLS;
  const borderStroke = isDark ? "#13161c" : "#ffffff";

  const byCode = useMemo(
    () =>
      new Map(
        countries
          .filter((row) => row.code)
          .map((row) => [String(row.code).toUpperCase(), row]),
      ),
    [countries],
  );

  const max = useMemo(
    () => countries.reduce((current, row) => Math.max(current, metricValueOf(row, metric)), 0),
    [countries, metric],
  );

  if (!max) {
    return (
      <div className="grid min-h-56 place-items-center p-6 text-center">
        <div className="grid justify-items-center gap-1.5">
          <Globe className="size-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs font-medium text-foreground">No geographic data yet</p>
          <p className="text-xs text-muted-foreground">Countries light up here as traffic arrives.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={(event) => setActive(resolvePointerTooltip(event, wrapRef.current, byCode))}
      onPointerLeave={() => setActive(null)}
      onPointerCancel={() => setActive(null)}
      className="relative aspect-[2.12/1] w-full overflow-visible px-3 pt-2 pb-3 select-none [&_.rsm-geography]:cursor-pointer [&_.rsm-geography]:outline-none [&_.rsm-geography]:transition-[filter] [&_.rsm-geography]:duration-100 [&_.rsm-geography:focus-visible]:brightness-90 [&_.rsm-geography:hover]:brightness-92 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
    >
      <ComposableMap
        role="group"
        aria-label="World map of traffic by country"
        projection="geoEqualEarth"
        projectionConfig={{ center: [10, 11], scale: 154 }}
        width={800}
        height={365}
      >
        <Geographies geography={world}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties?.name !== "Antarctica")
              .map((geography) => {
                const rawName = geography.properties?.name || "Unknown";
                const code = COUNTRY_CODE_BY_NAME.get(normalizeGeoName(rawName)) || "";
                const row = code ? byCode.get(code) : null;
                const label = code ? regionNames.of(code) || rawName : rawName;
                const pv = row?.pageviews ?? 0;
                const vis = row?.visitors ?? 0;

                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    fill={fillForValue(metricValueOf(row, metric), max, palette)}
                    stroke={borderStroke}
                    strokeWidth={0.6}
                    data-map-code={code}
                    data-map-name={label}
                    aria-label={`${label}: ${formatExact(pv)} requests, ${formatExact(vis)} visits`}
                  />
                );
              })
          }
        </Geographies>
      </ComposableMap>

      <MapScaleLegend palette={palette} max={max} />
      <MapTooltip active={active} metric={metric} total={total} />
    </div>
  );
}
