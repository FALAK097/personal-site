"use client";
import {
  DEFAULT_ECHARTS_RENDERER,
  buildChartCss,
  flattenColor,
  getColorsCount,
  resolveColors,
  seriesPaint,
  withAlpha
} from "@/components/evilcharts/ui/echarts-chart";
import {
  tooltipBaseOption,
  tooltipIndicatorHtml,
  tooltipRow,
  tooltipShell
} from "@/components/evilcharts/ui/echarts-tooltip";
import {
  Brush,
  buildBrushDataZoom,
  syncBrushOverlay
} from "@/components/evilcharts/ui/echarts-brush";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent
} from "echarts/components";
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { dotItemStyle, dotStyle, sampleGradient } from "@/components/evilcharts/ui/echarts-dot";
import { LegendOverlay } from "@/components/evilcharts/ui/echarts-legend";
import { LineChart } from "echarts/charts";
import { motion, useReducedMotion } from "motion/react";
import * as echarts from "echarts/core";
echarts.use([LineChart, GridComponent, TooltipComponent, DataZoomComponent]);
const STROKE_WIDTH = 0.8;
const LOADING_ANIMATION_DURATION = 2e3;
const REVEAL_DURATION = 1e3;
const LOADING_DEFAULT_POINTS = 14;
const BUFFER_DASH = [4, 3];
const GRID_LINE_OPACITY = 1;
const AXIS_POINTER_OPACITY = 1;
const LOADING_STROKE_OPACITY = 0.5;
const LOADING_SHIMMER_MAX_OPACITY = 0.03;
const LOADING_SHIMMER_BAND = 0.2;
const LOADING_SHIMMER_FEATHER = 0.2;
const BRUSH_STROKE_OPACITY = 0.5;
const BRUSH_FILL_OPACITY = 0.15;
const BRUSH_FILLER_OPACITY = 0;
const Area = () => null;
const Dot = () => null;
const ActiveDot = () => null;
const XAxis = () => null;
const YAxis = () => null;
const Grid = () => null;
const Tooltip = () => null;
const Legend = () => null;
function collectConfig(children) {
  const areas = [];
  let xAxis = { present: false, hideDots: false };
  let yAxis = { present: false, hideDots: false };
  let showGrid = false;
  let tooltip = {
    present: false,
    variant: "default",
    roundness: "lg",
    cursor: true,
    position: "variable"
  };
  let legend = {
    present: false,
    variant: "rounded-square",
    align: "right",
    verticalAlign: "top",
    isClickable: false
  };
  let brush = { present: false };
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = child.type;
    if (type === Area) {
      const props = child.props;
      let dotVariant = "none";
      let activeDotVariant = "none";
      Children.forEach(props.children, (dotChild) => {
        if (!isValidElement(dotChild)) return;
        if (dotChild.type === Dot) {
          dotVariant = dotChild.props.variant ?? "default";
        } else if (dotChild.type === ActiveDot) {
          activeDotVariant = dotChild.props.variant ?? "default";
        }
      });
      areas.push({
        dataKey: props.dataKey,
        variant: props.variant ?? "gradient",
        strokeVariant: props.strokeVariant ?? "dashed",
        strokeWidth: props.strokeWidth ?? STROKE_WIDTH,
        curveType: props.curveType,
        animationType: props.animationType,
        connectNulls: props.connectNulls ?? false,
        isClickable: props.isClickable ?? false,
        enableBufferLine: props.enableBufferLine ?? false,
        dotVariant,
        activeDotVariant
      });
    } else if (type === XAxis) {
      const props = child.props;
      xAxis = {
        present: true,
        dataKey: props.dataKey,
        tickFormatter: props.tickFormatter,
        label: props.label,
        hideDots: props.hideDots ?? false
      };
    } else if (type === YAxis) {
      const props = child.props;
      yAxis = {
        present: true,
        dataKey: props.dataKey,
        tickFormatter: props.tickFormatter,
        label: props.label,
        hideDots: props.hideDots ?? false
      };
    } else if (type === Grid) {
      showGrid = true;
    } else if (type === Tooltip) {
      const props = child.props;
      tooltip = {
        present: true,
        variant: props.variant ?? "default",
        roundness: props.roundness ?? "lg",
        cursor: props.cursor ?? true,
        position: props.position ?? "variable"
      };
    } else if (type === Legend) {
      const props = child.props;
      legend = {
        present: true,
        variant: props.variant ?? "rounded-square",
        align: props.align ?? "right",
        verticalAlign: props.verticalAlign ?? "top",
        isClickable: props.isClickable ?? false
      };
    } else if (type === Brush) {
      const props = child.props;
      brush = {
        present: true,
        height: props.height,
        formatLabel: props.formatLabel,
        onChange: props.onChange
      };
    }
  });
  return { areas, xAxis, yAxis, showGrid, tooltip, legend, brush };
}
function patternFill(kind, color) {
  if (typeof document === "undefined") return null;
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const size = (width, height) => {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  };
  const pattern = (rotation = 0) => ({
    image: canvas,
    repeat: "repeat",
    rotation,
    scaleX: 1 / dpr,
    scaleY: 1 / dpr
  });
  if (kind === "dotted") {
    size(6, 6);
    ctx.fillStyle = withAlpha(color, 0.7);
    ctx.beginPath();
    ctx.arc(3, 3, 0.85, 0, Math.PI * 2);
    ctx.fill();
    return pattern();
  }
  if (kind === "lines" || kind === "stripe") {
    size(5, 5);
    ctx.strokeStyle = withAlpha(color, 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(2.5, -1);
    ctx.lineTo(2.5, 6);
    ctx.stroke();
    return pattern(-Math.PI / 4);
  }
  size(20, 20);
  ctx.fillStyle = withAlpha(color, 0.06);
  ctx.fillRect(0, 0, 10, 20);
  ctx.fillStyle = withAlpha(color, 0.22);
  ctx.fillRect(10, 0, 10, 20);
  return pattern(20 * Math.PI / 180);
}
function gradientFillTexture(slots, width, height, reverse) {
  if (typeof document === "undefined" || width < 1 || height < 1) return null;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width);
  canvas.height = Math.ceil(height);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const colors = ctx.createLinearGradient(0, 0, canvas.width, 0);
  slots.forEach((color, i) => colors.addColorStop(i / (slots.length - 1), color));
  ctx.fillStyle = colors;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const fade = ctx.createLinearGradient(0, 0, 0, canvas.height);
  fade.addColorStop(0, `rgba(0, 0, 0, ${reverse ? 0 : 0.1})`);
  fade.addColorStop(1, `rgba(0, 0, 0, ${reverse ? 0.1 : 0})`);
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}
function patternFadeTexture(kind, color, width, height) {
  const patternObj = patternFill(kind, color);
  if (!patternObj || typeof document === "undefined" || width < 1 || height < 1) return null;
  const tile = patternObj.image;
  if (!(tile instanceof HTMLCanvasElement)) return null;
  const rotation = patternObj.rotation ?? 0;
  const tileScale = patternObj.scaleX ?? 1;
  const w = Math.ceil(width);
  const h = Math.ceil(height);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const pat = ctx.createPattern(tile, "repeat");
  if (!pat) return null;
  if (typeof pat.setTransform === "function") {
    const m = new DOMMatrix();
    m.rotateSelf(rotation * 180 / Math.PI);
    m.scaleSelf(tileScale, tileScale);
    pat.setTransform(m);
  }
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, w, h);
  const fade = ctx.createLinearGradient(0, 0, 0, h);
  fade.addColorStop(0, "rgba(0, 0, 0, 1)");
  fade.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);
  return canvas;
}
function fillPaint(variant, showUnselected, slots, size) {
  const base = slots[0] ?? "rgba(120, 120, 120, 1)";
  const multi = slots.length > 1;
  if (variant === "none") return "transparent";
  if (showUnselected) {
    return patternFill("stripe", base) ?? withAlpha(base, 0.1);
  }
  switch (variant) {
    case "gradient":
    case "gradient-reverse": {
      const reverse = variant === "gradient-reverse";
      if (multi) {
        const texture = gradientFillTexture(slots, size.width, size.height, reverse);
        if (texture) return { image: texture, repeat: "no-repeat" };
      }
      return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: withAlpha(base, reverse ? 0 : 0.1) },
        { offset: 1, color: withAlpha(base, reverse ? 0.1 : 0) }
      ]);
    }
    case "solid": {
      if (multi) {
        return new echarts.graphic.LinearGradient(
          0,
          0,
          1,
          0,
          slots.map((color, i) => ({
            offset: i / (slots.length - 1),
            color: withAlpha(color, 0.1)
          }))
        );
      }
      return withAlpha(base, 0.1);
    }
    case "dotted":
    case "lines":
    case "hatched": {
      const texture = patternFadeTexture(variant, base, size.width, size.height);
      if (texture) return { image: texture, repeat: "no-repeat" };
      return patternFill(variant, base) ?? withAlpha(base, 0.1);
    }
    default:
      return withAlpha(base, 0.1);
  }
}
function curveConfig(curveType) {
  if (curveType === "step") return { smooth: false, step: "middle" };
  if (curveType === "linear") return { smooth: false, step: false };
  return { smooth: true, step: false };
}
function getOpacity(selected, key) {
  if (selected === null || selected === key) return { fill: 0.8, stroke: 1, dot: 1 };
  return { fill: 0.1, stroke: 0.3, dot: 0.3 };
}
function getLoadingData(points) {
  const rows = [];
  let value = 30 + Math.random() * 20;
  for (let i = 0; i < points; i++) {
    value = Math.min(58, Math.max(16, value + (Math.random() - 0.5) * 16));
    rows.push(Math.round(value));
  }
  return rows;
}
function shimmerWindowStops(center, color, peak) {
  const half = LOADING_SHIMMER_BAND;
  const feather = LOADING_SHIMMER_FEATHER;
  const alphaAt = (x) => {
    const dist = Math.abs(x - center);
    if (dist <= half - feather) return peak;
    if (dist >= half) return 0;
    return peak * Math.sin((1 - (dist - (half - feather)) / feather) * Math.PI / 2);
  };
  const offsets = [
    0,
    center - half,
    center - half + feather,
    center,
    center + half - feather,
    center + half,
    1
  ].filter((x) => x >= 0 && x <= 1).sort((a, b) => a - b);
  const stops = [];
  for (const offset of offsets) {
    if (stops.length === 0 || offset - stops[stops.length - 1].offset > 1e-4) {
      stops.push({ offset, color: withAlpha(color, alphaAt(offset)) });
    }
  }
  return stops;
}
const BUFFER_PREFIX = "__buffer-";
const BUFFERFILL_PREFIX = "__bufferfill-";
const REVEAL_PREFIX = "__reveal-";
function buildChartLayout({ legendSlot, xAxisSlot, showBrush, brushHeight }) {
  const legendTop = legendSlot.present && legendSlot.verticalAlign === "top";
  const legendBottom = legendSlot.present && legendSlot.verticalAlign === "bottom";
  const brushGap = showBrush ? brushHeight + 30 + (xAxisSlot.label ? 22 : 0) : 0;
  return {
    grid: {
      left: 8,
      right: 8,
      top: legendTop ? 42 : 16,
      bottom: 8 + brushGap + (legendBottom ? 34 : 0)
    },
    brushBottom: legendBottom ? 34 : 6
  };
}
function buildMainAxes(ctx) {
  const { xAxisSlot, yAxisSlot, showGrid, isLoading, isExpanded, categories, loadingData } = ctx;
  const { tokens } = ctx.resolved;
  const axisLabelColor = tokens.mutedForeground;
  const splitLineColor = withAlpha(tokens.border, GRID_LINE_OPACITY);
  const tickDotColor = flattenColor(splitLineColor, tokens.background);
  const xTickFormatter = xAxisSlot.tickFormatter;
  const yTickFormatter = yAxisSlot.tickFormatter;
  const xAxis = {
    type: "category",
    boundaryGap: false,
    show: true,
    data: isLoading ? loadingData().map((_, i) => i) : categories,
    // Axis title — same size/color as the tick labels, pushed clear of them.
    name: isLoading ? void 0 : xAxisSlot.label,
    nameLocation: "middle",
    nameGap: 30,
    nameTextStyle: { color: axisLabelColor, fontSize: 10 },
    axisLine: { show: false },
    // Tick DOTS: a near-zero-length tick whose round caps form a true circle,
    // in the gridline gray (flattened opaque so the caps don't stack).
    axisTick: {
      show: !isLoading && xAxisSlot.present && !xAxisSlot.hideDots,
      // Ticks default to the BOUNDARY between categories, which on a boundaryGap
      // axis drops the dot in the gap instead of under its label. A no-op here
      // (boundaryGap is false), kept for parity with the bar/composed charts.
      alignWithLabel: true,
      length: 0.5,
      lineStyle: { color: tickDotColor, width: 3, cap: "round" }
    },
    splitLine: { show: false },
    axisLabel: {
      show: !isLoading && xAxisSlot.present,
      color: axisLabelColor,
      fontSize: 10,
      margin: 8,
      formatter: xTickFormatter ? (value, index) => xTickFormatter(value, index) : void 0
    }
  };
  const yAxis = {
    type: "value",
    show: yAxisSlot.present || showGrid,
    max: isExpanded ? 1 : void 0,
    // Axis title — rendered rotated alongside the tick labels, same styling.
    name: isLoading ? void 0 : yAxisSlot.label,
    nameLocation: "middle",
    nameGap: 38,
    nameTextStyle: { color: axisLabelColor, fontSize: 10 },
    axisLine: { show: false },
    // Same tick dots as the x-axis, beside each value label. No alignWithLabel
    // here: ECharts types it on the CATEGORY axis only, and a value axis already
    // puts its ticks on the labels.
    axisTick: {
      show: yAxisSlot.present && !isLoading && !yAxisSlot.hideDots,
      length: 0.5,
      lineStyle: { color: tickDotColor, width: 3, cap: "round" }
    },
    splitLine: {
      // Hidden while loading — the skeleton floats on a clean canvas.
      show: showGrid && !isLoading,
      lineStyle: { color: splitLineColor, type: [3, 3], width: 1 }
    },
    axisLabel: {
      // Hidden while loading — skeleton values are meaningless, and the
      // Recharts YAxis unmounts during loading too.
      show: yAxisSlot.present && !isLoading,
      color: axisLabelColor,
      fontSize: 10,
      margin: 8,
      formatter: isExpanded ? (value) => `${Math.round(value * 100)}%` : yTickFormatter ? (value, index) => yTickFormatter(value, index) : void 0
    }
  };
  return { xAxis, yAxis };
}
function createTooltipFormatter(ctx) {
  const { config, selectedDataKey, tooltipSlot, getHoveredKey } = ctx;
  return (params) => {
    const rows = Array.isArray(params) ? params : [params];
    if (!rows.length) return "";
    const first = rows[0];
    const axisValue = first.axisValue ?? first.name ?? "";
    const label = String(axisValue);
    const seen = /* @__PURE__ */ new Set();
    const body = rows.map((param) => {
      const p = param;
      const rawId = String(p.seriesId ?? "");
      const key = rawId.startsWith(BUFFER_PREFIX) ? rawId.slice(BUFFER_PREFIX.length) : rawId.startsWith("__") ? "" : p.seriesId ?? p.seriesName ?? "";
      if (!key) return "";
      if (p.value === null || p.value === void 0) return "";
      if (seen.has(key)) return "";
      seen.add(key);
      const item = config[key];
      const colorsCount = item ? getColorsCount(item) : 1;
      const labelText = typeof item?.label === "string" ? item.label : p.seriesName ?? key;
      const hovered = getHoveredKey();
      const dimmed = selectedDataKey != null && selectedDataKey !== key || hovered != null && hovered !== key ? " opacity-30" : "";
      const value = typeof p.value === "number" ? p.value.toLocaleString() : String(p.value ?? "");
      return tooltipRow({
        indicatorHtml: tooltipIndicatorHtml(key, colorsCount),
        labelText,
        valueText: value,
        dimmed
      });
    }).join("");
    return tooltipShell({
      label,
      body,
      roundness: tooltipSlot.roundness,
      variant: tooltipSlot.variant
    });
  };
}
function buildTooltipOption(ctx) {
  const { tooltipSlot, isLoading } = ctx;
  const { tokens } = ctx.resolved;
  return {
    ...tooltipBaseOption({
      present: tooltipSlot.present && !isLoading,
      cursor: tooltipSlot.cursor,
      tokens,
      position: tooltipSlot.position,
      axisPointerColor: withAlpha(tokens.border, AXIS_POINTER_OPACITY),
      strokeWidth: STROKE_WIDTH
    }),
    formatter: createTooltipFormatter(ctx)
  };
}
function buildBrushOption(ctx, brushBottom) {
  const { data, areas, curveType, isStacked, selectedDataKey, brushHeight, categories } = ctx;
  const { tokens } = ctx.resolved;
  const miniGrid = {
    left: 8,
    right: 8,
    bottom: brushBottom,
    height: brushHeight,
    // No visible axes here — opt out of label containment so the mini chart
    // spans the full brush frame.
    outerBoundsMode: "none"
  };
  const miniXAxis = {
    type: "category",
    gridIndex: 1,
    boundaryGap: false,
    show: false,
    data: categories,
    axisPointer: { show: false }
  };
  const miniYAxis = { type: "value", gridIndex: 1, show: false };
  const miniSeries = areas.map((area) => {
    const key = area.dataKey;
    const base = (ctx.resolved.series[key] ?? [])[0] ?? "rgba(120, 120, 120, 1)";
    const curve = curveConfig(area.curveType ?? curveType);
    const opacity = getOpacity(selectedDataKey, key);
    const strokeDim = opacity.stroke;
    const fillDim = opacity.fill / 0.8;
    return {
      id: `__mini-${key}`,
      type: "line",
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: data.map((row) => Number(row[key]) || 0),
      stack: isStacked ? "__mini-total" : void 0,
      smooth: curve.smooth,
      step: curve.step,
      connectNulls: area.connectNulls,
      silent: true,
      showSymbol: false,
      emphasis: { disabled: true },
      tooltip: { show: false },
      lineStyle: { color: base, width: 1, opacity: BRUSH_STROKE_OPACITY * strokeDim },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: withAlpha(base, BRUSH_FILL_OPACITY * fillDim) },
          { offset: 1, color: withAlpha(base, 0) }
        ])
      },
      z: 0
    };
  });
  const dataZoom = buildBrushDataZoom({
    brushBottom,
    brushHeight,
    brushRange: ctx.brushRange,
    fillerColor: withAlpha(tokens.foreground, BRUSH_FILLER_OPACITY)
  });
  return { miniGrid, miniXAxis, miniYAxis, miniSeries, dataZoom };
}
function buildLoadingOption(ctx, frame) {
  const { tokens } = ctx.resolved;
  const curve = curveConfig(ctx.curveType);
  return {
    animation: false,
    grid: frame.grid,
    xAxis: frame.xAxis,
    yAxis: frame.yAxis,
    tooltip: { show: false },
    series: [
      {
        id: "__loading",
        type: "line",
        data: ctx.loadingData(),
        smooth: curve.smooth,
        step: curve.step,
        showSymbol: false,
        silent: true,
        // Invisible until the first shimmer tick positions the clip window.
        lineStyle: { color: withAlpha(tokens.foreground, 0), width: 1 },
        areaStyle: { color: withAlpha(tokens.foreground, 0) },
        z: 1
      }
    ]
  };
}
function buildAreaSeries(ctx) {
  const {
    data,
    config,
    areas,
    seriesKeys,
    curveType,
    isStacked,
    isExpanded,
    selectedDataKey,
    hasSelection,
    enableHoverHighlight,
    enableHoverReveal,
    revealIndex,
    revealSink,
    resolved,
    rendererSize
  } = ctx;
  const rowTotals = isExpanded ? data.map((row) => seriesKeys.reduce((sum, key) => sum + (Number(row[key]) || 0), 0)) : [];
  return areas.flatMap((area) => {
    const key = area.dataKey;
    const slots = resolved.series[key] ?? ["rgba(120, 120, 120, 1)"];
    const paint = seriesPaint(slots);
    const isSelected = selectedDataKey === key;
    const showUnselected = hasSelection && !isSelected;
    const opacity = getOpacity(selectedDataKey, key);
    const curve = curveConfig(area.curveType ?? curveType);
    const values = data.map((row, i) => {
      const value = Number(row[key]) || 0;
      if (!isExpanded) return value;
      const total = rowTotals[i];
      return total ? value / total : 0;
    });
    const n = values.length;
    const reveal = enableHoverReveal;
    const buffer = !reveal && area.enableBufferLine && n >= 2;
    const revealActive = reveal && revealIndex !== null;
    const restingDot = dotStyle(area.dotVariant, paint, resolved.tokens.background);
    const activeDot = dotStyle(area.activeDotVariant, paint, resolved.tokens.background);
    const restingVisible = area.dotVariant !== "none";
    const dotOpacity = opacity.dot;
    const multiColor = slots.length > 1;
    const strokePaint = reveal && multiColor ? new echarts.graphic.LinearGradient(
      8,
      0,
      Math.max(rendererSize.width - 8, 9),
      0,
      slots.map((color, i) => ({ offset: i / (slots.length - 1), color })),
      true
    ) : paint;
    const toPoints = (vals) => !multiColor ? vals : vals.map((value, i) => {
      if (value === null) return null;
      const t = vals.length > 1 ? i / (vals.length - 1) : 0;
      const pointColor = sampleGradient(slots, t);
      return {
        value,
        itemStyle: {
          ...dotItemStyle(
            restingVisible ? area.dotVariant : area.activeDotVariant,
            pointColor,
            resolved.tokens.background
          ),
          opacity: dotOpacity
        },
        emphasis: {
          itemStyle: {
            ...dotItemStyle(
              area.activeDotVariant === "none" ? "default" : area.activeDotVariant,
              pointColor,
              resolved.tokens.background
            ),
            opacity: 1
          }
        }
      };
    });
    if (reveal) revealSink[key] = toPoints(values);
    const mainValues = buffer ? values.map((v, i) => i === n - 1 ? null : v) : revealActive ? sliceToNull(values, revealIndex) : values;
    const mainDash = buffer || area.strokeVariant === "solid" ? "solid" : [3, 3];
    const z = isSelected ? 3 : hasSelection ? 1 : 2;
    const mainSeries = {
      id: key,
      name: typeof config[key]?.label === "string" ? config[key]?.label : key,
      type: "line",
      data: toPoints(mainValues),
      stack: isStacked ? "total" : void 0,
      smooth: curve.smooth,
      step: curve.step,
      connectNulls: area.connectNulls,
      cursor: area.isClickable ? "pointer" : "default",
      // By default ECharts only fires mouse events on the symbols — this makes
      // the line AND the filled area clickable, like the Recharts <Area>.
      // (`true` covers both; the deprecated `triggerLineEvent` did the same.)
      triggerEvent: area.isClickable,
      showSymbol: restingVisible,
      symbol: "circle",
      symbolSize: restingVisible ? restingDot.size : activeDot.size,
      z,
      lineStyle: {
        color: strokePaint,
        width: area.strokeWidth,
        opacity: opacity.stroke,
        type: mainDash,
        dashOffset: 0
      },
      itemStyle: multiColor ? { opacity: dotOpacity } : {
        ...restingVisible ? restingDot.itemStyle : activeDot.itemStyle,
        opacity: dotOpacity
      },
      areaStyle: {
        color: fillPaint(area.variant, showUnselected, slots, rendererSize),
        opacity: opacity.fill
      },
      emphasis: {
        // focus "series" blurs every other series in this grid while one is
        // hovered — the hover twin of the click selection. Suppressed entirely
        // while a series is click-selected: the selection dim owns the canvas,
        // so hover highlighting stops until the selection clears (the option
        // rebuilds on selection change, making this a build-time conditional).
        // Reveal owns the hover visual, so native focus-blur stands down when it
        // is on (they must not blend).
        focus: enableHoverHighlight && !enableHoverReveal && !hasSelection ? "series" : "none",
        scale: restingVisible ? activeDot.size / Math.max(restingDot.size, 1) : 1,
        ...multiColor ? {} : { itemStyle: { ...activeDot.itemStyle, opacity: 1 } }
      },
      // Blur styling mirrors the click-selection dim (fill 0.1 / stroke 0.3 / dot 0.3).
      blur: {
        lineStyle: { opacity: 0.3 },
        areaStyle: { opacity: 0.1 },
        itemStyle: { opacity: 0.3 }
      }
    };
    if (reveal) {
      const muted = resolved.tokens.mutedForeground;
      const revealBase = {
        id: `${REVEAL_PREFIX}${key}`,
        type: "line",
        // Only the region FROM the cursor onward (null before it), so the gray
        // never sits under the colored part — the two meet exactly at the
        // pointer and their colors can't mix.
        data: revealActive ? sliceFrom(values, revealIndex) : values,
        // Its OWN stack, not "total" — a second series in the real stack would
        // double every key's contribution (broken geometry). This mirror stack
        // reproduces the same cumulative shape in a separate layer.
        stack: isStacked ? "__reveal-total" : void 0,
        smooth: curve.smooth,
        step: curve.step,
        connectNulls: false,
        silent: true,
        showSymbol: false,
        symbol: "circle",
        z: z - 1,
        // Neutral gray, NO fill, SAME dash pattern as the colored line.
        lineStyle: {
          color: muted,
          width: area.strokeWidth,
          type: mainDash,
          opacity: revealActive ? 0.3 : 0
        },
        emphasis: { disabled: true },
        blur: { lineStyle: { opacity: revealActive ? 0.3 : 0 } },
        tooltip: { show: false }
      };
      return [revealBase, mainSeries];
    }
    if (!buffer) return [mainSeries];
    const bufferValues = values.map((v, i) => i >= n - 2 ? v : null);
    const bufferSeries = {
      id: `${BUFFER_PREFIX}${key}`,
      type: "line",
      data: toPoints(bufferValues),
      // Own mirror stack — a second series in "total" would double the last
      // points' stacked height (buffer drawn too high). Same values in the same
      // order give the identical cumulative height, so the dash lines up.
      stack: isStacked ? "__buffer-total" : void 0,
      smooth: curve.smooth,
      step: curve.step,
      connectNulls: true,
      silent: true,
      showSymbol: restingVisible,
      symbol: "circle",
      symbolSize: restingVisible ? restingDot.size : activeDot.size,
      z,
      lineStyle: {
        color: paint,
        width: area.strokeWidth,
        opacity: opacity.stroke,
        type: BUFFER_DASH
      },
      itemStyle: multiColor ? { opacity: dotOpacity } : {
        ...restingVisible ? restingDot.itemStyle : activeDot.itemStyle,
        opacity: dotOpacity
      },
      // The dashed tail is a separate silent series, so focus:"series" on its
      // parent would blur it apart from the area it belongs to. The root
      // dispatch-links this id (companionIdsByKey) so it focuses WITH its parent;
      // these styles give it the parent's look while focused and the
      // click-selection dim while another series is hovered.
      emphasis: {
        focus: "none",
        scale: false,
        lineStyle: { opacity: opacity.stroke },
        itemStyle: { opacity: dotOpacity }
      },
      blur: { lineStyle: { opacity: 0.3 }, itemStyle: { opacity: 0.3 } }
    };
    const bufferFillSeries = {
      id: `${BUFFERFILL_PREFIX}${key}`,
      type: "line",
      data: toPoints(bufferValues),
      stack: isStacked ? "__bufferfill-total" : void 0,
      smooth: curve.smooth,
      step: curve.step,
      connectNulls: true,
      silent: true,
      showSymbol: false,
      z: z - 1,
      lineStyle: { opacity: 0 },
      areaStyle: {
        color: fillPaint(area.variant, showUnselected, slots, rendererSize),
        opacity: opacity.fill
      },
      emphasis: { disabled: true },
      blur: { areaStyle: { opacity: 0.1 } },
      tooltip: { show: false }
    };
    return [mainSeries, bufferSeries, bufferFillSeries];
  });
}
function sliceToNull(vals, idx) {
  return vals.map((v, i) => i > idx ? null : v);
}
function sliceFrom(vals, idx) {
  return vals.map((v, i) => i < idx ? null : v);
}
function computePlottedTops(ctx) {
  const { data, areas, seriesKeys, isStacked, isExpanded } = ctx;
  const rowTotals = isExpanded ? data.map((row) => seriesKeys.reduce((sum, key) => sum + (Number(row[key]) || 0), 0)) : [];
  const running = new Array(data.length).fill(0);
  const tops = {};
  for (const area of areas) {
    const key = area.dataKey;
    tops[key] = data.map((row, i) => {
      let value = Number(row[key]) || 0;
      if (isExpanded) value = rowTotals[i] ? value / rowTotals[i] : 0;
      return isStacked ? running[i] += value : value;
    });
  }
  return tops;
}
function resolveAreaAtPixel(chart, tops, keys, x, y) {
  if (keys.length < 2) return null;
  if (!chart.containPixel({ gridIndex: 0 }, [x, y])) return null;
  const [rawIndex] = chart.convertFromPixel({ gridIndex: 0 }, [x, y]);
  const index = Math.round(rawIndex);
  let nearest = null;
  let nearestDist = Infinity;
  let above = null;
  let abovePixelY = -Infinity;
  for (const key of keys) {
    const value = tops[key]?.[index];
    if (value === void 0) continue;
    const pixelY = chart.convertToPixel({ gridIndex: 0 }, [index, value])[1];
    const dist = Math.abs(pixelY - y);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = key;
    }
    if (pixelY <= y && pixelY > abovePixelY) {
      abovePixelY = pixelY;
      above = key;
    }
  }
  return nearestDist <= 10 ? nearest : above;
}
function EChartsAreaChart({
  data,
  config,
  renderer = DEFAULT_ECHARTS_RENDERER,
  xDataKey,
  className,
  curveType = "linear",
  stackType = "default",
  animation = true,
  animationType = "left-to-right",
  enableHoverHighlight = false,
  enableHoverReveal = false,
  defaultSelectedDataKey = null,
  selectedDataKey: selectedDataKeyProp,
  onSelectionChange,
  isLoading = false,
  loadingPoints = LOADING_DEFAULT_POINTS,
  chartOptions,
  children
}) {
  const rawId = useId();
  const chartId = `chart-${rawId.replace(/:/g, "")}`;
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const echartsRef = useRef(null);
  const live = useRef({
    resolved: null,
    hoveredKey: null,
    hasRevealed: false,
    revealEndsAt: 0,
    loadingRows: null,
    categories: [],
    dataLength: 0,
    plottedTops: {},
    seriesKeyByIndex: [],
    companionIdsByKey: /* @__PURE__ */ new Map(),
    revealIndex: null,
    revealValues: {},
    brushRange: { start: 0, end: 100 },
    brushGeom: null,
    brushOverlay: null,
    brushHover: { inside: false, left: false, right: false },
    handlers: {
      onBrushChange: void 0,
      // set per-render from the <Brush> child's onChange
      onSelectionChange,
      clickableKeys: /* @__PURE__ */ new Set(),
      selectedDataKey: defaultSelectedDataKey,
      brushFormatLabel: void 0,
      // set per-render from the <Brush> child's formatLabel
      seriesKeys: [],
      enableHoverHighlight,
      enableHoverReveal
    },
    repush: () => {
    }
  }).current;
  const loadingData = useCallback(
    () => live.loadingRows ??= getLoadingData(loadingPoints),
    [live, loadingPoints]
  );
  const shouldReduceMotion = useReducedMotion();
  const [internalSelectedKey, setSelectedDataKey] = useState(defaultSelectedDataKey);
  const selectedDataKey = selectedDataKeyProp !== void 0 ? selectedDataKeyProp : internalSelectedKey;
  const [hoveredDataKey, setHoveredDataKey] = useState(null);
  const collected = useMemo(() => collectConfig(children), [children]);
  const {
    areas,
    xAxis: xAxisSlot,
    yAxis: yAxisSlot,
    showGrid,
    tooltip: tooltipSlot,
    legend: legendSlot,
    brush: brushSlot
  } = collected;
  const showBrush = brushSlot.present;
  const brushHeight = brushSlot.height ?? 56;
  const seriesKeys = useMemo(() => areas.map((area) => area.dataKey), [areas]);
  const xCategoryKey = useMemo(() => {
    if (xAxisSlot.dataKey) return xAxisSlot.dataKey;
    if (xDataKey) return xDataKey;
    const firstRow = data[0];
    if (firstRow) {
      const claimed = new Set(seriesKeys);
      const found = Object.keys(firstRow).find((key) => !claimed.has(key));
      if (found) return found;
    }
    return "";
  }, [xAxisSlot.dataKey, xDataKey, data, seriesKeys]);
  const effectiveAnimation = areas[0]?.animationType ?? animationType;
  const css = useMemo(() => buildChartCss(chartId, config), [chartId, config]);
  const hasSelection = selectedDataKey !== null;
  const isExpanded = stackType === "expanded";
  const isStacked = stackType === "stacked" || isExpanded;
  const clickableKeys = useMemo(
    () => new Set(areas.filter((area) => area.isClickable).map((area) => area.dataKey)),
    [areas]
  );
  live.handlers = {
    onBrushChange: brushSlot.onChange,
    onSelectionChange,
    clickableKeys,
    selectedDataKey,
    brushFormatLabel: brushSlot.formatLabel,
    seriesKeys,
    enableHoverHighlight,
    enableHoverReveal
  };
  live.dataLength = data.length;
  const toggleSelection = useCallback(
    (key) => {
      const next = live.handlers.selectedDataKey === key ? null : key;
      if (next !== null && live.hoveredKey !== null) {
        const previous = live.hoveredKey;
        live.hoveredKey = null;
        setHoveredDataKey(null);
        echartsRef.current?.dispatchAction({
          type: "downplay",
          seriesIndex: live.handlers.seriesKeys.indexOf(previous)
        });
      }
      setSelectedDataKey(next);
      live.handlers.onSelectionChange?.(next);
    },
    [live]
  );
  const syncBrushOverlayNow = useCallback(() => {
    const chart = echartsRef.current;
    if (!chart) return;
    const geom = live.brushGeom;
    const tokens = live.resolved?.tokens;
    if (!geom || !tokens) {
      syncBrushOverlay(chart, live, null);
      return;
    }
    const range = live.brushRange;
    const categories = live.categories;
    const format = live.handlers.brushFormatLabel;
    const lastIndex = Math.max(categories.length - 1, 0);
    const startIndex = Math.round(range.start / 100 * lastIndex);
    const endIndex = Math.round(range.end / 100 * lastIndex);
    const labels = format && categories.length ? {
      start: format(categories[startIndex] ?? "", startIndex),
      end: format(categories[endIndex] ?? "", endIndex)
    } : null;
    syncBrushOverlay(chart, live, {
      range,
      geom,
      size: { width: chart.getWidth(), height: chart.getHeight() },
      tokens,
      labels,
      showLabels: live.brushHover.inside,
      hover: live.brushHover
    });
  }, [live]);
  const buildOption = useCallback(() => {
    const resolved = live.resolved;
    if (!resolved) return {};
    const categories = data.map((row) => String(row[xCategoryKey]));
    live.categories = categories;
    const revealSink = {};
    const ctx = {
      data,
      config,
      areas,
      seriesKeys,
      curveType,
      isStacked,
      isExpanded,
      selectedDataKey,
      hasSelection,
      showGrid,
      xAxisSlot,
      yAxisSlot,
      tooltipSlot,
      legendSlot,
      isLoading,
      loadingData,
      showBrush,
      brushHeight,
      enableHoverHighlight,
      enableHoverReveal,
      revealIndex: live.revealIndex,
      resolved,
      rendererSize: {
        width: echartsRef.current?.getWidth() ?? mountRef.current?.clientWidth ?? 0,
        height: echartsRef.current?.getHeight() ?? mountRef.current?.clientHeight ?? 0
      },
      categories,
      brushRange: live.brushRange,
      getHoveredKey: () => live.hoveredKey,
      revealSink
    };
    live.plottedTops = computePlottedTops(ctx);
    const { grid, brushBottom } = buildChartLayout(ctx);
    live.brushGeom = showBrush ? { bottom: brushBottom, height: brushHeight } : null;
    const { xAxis, yAxis } = buildMainAxes(ctx);
    if (isLoading) return buildLoadingOption(ctx, { grid, xAxis, yAxis });
    const brush = showBrush ? buildBrushOption(ctx, brushBottom) : null;
    const series = [...buildAreaSeries(ctx), ...brush?.miniSeries ?? []];
    if (enableHoverReveal) live.revealValues = revealSink;
    live.seriesKeyByIndex = series.map((s) => {
      const id = String(s.id ?? "");
      return id && !id.startsWith("__") ? id : void 0;
    });
    const companionIdsByKey = /* @__PURE__ */ new Map();
    for (const area of areas) {
      const ids = [];
      if (area.enableBufferLine && data.length >= 2) {
        ids.push(`${BUFFER_PREFIX}${area.dataKey}`, `${BUFFERFILL_PREFIX}${area.dataKey}`);
      }
      if (enableHoverReveal) ids.push(`${REVEAL_PREFIX}${area.dataKey}`);
      if (ids.length) companionIdsByKey.set(area.dataKey, ids);
    }
    live.companionIdsByKey = companionIdsByKey;
    return {
      animation: false,
      grid: brush ? [grid, brush.miniGrid] : grid,
      xAxis: brush ? [xAxis, brush.miniXAxis] : xAxis,
      yAxis: brush ? [yAxis, brush.miniYAxis] : yAxis,
      tooltip: buildTooltipOption(ctx),
      dataZoom: brush?.dataZoom,
      series
    };
  }, [
    live,
    data,
    config,
    areas,
    seriesKeys,
    xCategoryKey,
    curveType,
    isStacked,
    isExpanded,
    selectedDataKey,
    hasSelection,
    showGrid,
    xAxisSlot,
    yAxisSlot,
    tooltipSlot,
    legendSlot,
    isLoading,
    loadingData,
    showBrush,
    brushHeight,
    enableHoverHighlight,
    enableHoverReveal
  ]);
  useEffect(() => {
    const mount = mountRef.current;
    const container = containerRef.current;
    if (!mount || !container) return;
    live.hoveredKey = null;
    live.revealIndex = null;
    live.brushHover = { inside: false, left: false, right: false };
    setHoveredDataKey(null);
    const chart = echarts.init(mount, null, { renderer });
    echartsRef.current = chart;
    const resizeObserver = new ResizeObserver(() => {
      if (mount.clientWidth === chart.getWidth() && mount.clientHeight === chart.getHeight()) {
        return;
      }
      chart.resize();
      live.repush();
    });
    resizeObserver.observe(mount);
    const themeObserver = new MutationObserver(() => {
      live.repush();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    chart.on("click", (params) => {
      const { clickableKeys: clickable, seriesKeys: keys } = live.handlers;
      const p = params;
      let id = p.seriesId ?? (typeof p.seriesIndex === "number" ? live.seriesKeyByIndex[p.seriesIndex] : void 0);
      if (typeof p.event?.offsetX === "number" && typeof p.event?.offsetY === "number") {
        const resolved = resolveAreaAtPixel(
          chart,
          live.plottedTops,
          keys,
          p.event.offsetX,
          p.event.offsetY
        );
        if (resolved) id = resolved;
      }
      if (typeof id === "string" && clickable.has(id)) toggleSelection(id);
    });
    const applyHoverKey = (key) => {
      if (live.hoveredKey === key) return;
      const previous = live.hoveredKey;
      live.hoveredKey = key;
      setHoveredDataKey(key);
      if (previous) {
        chart.dispatchAction({ type: "downplay", seriesId: previous });
        for (const id of live.companionIdsByKey.get(previous) ?? [])
          chart.dispatchAction({ type: "downplay", seriesId: id });
      }
      if (key) {
        chart.dispatchAction({ type: "highlight", seriesId: key });
        for (const id of live.companionIdsByKey.get(key) ?? [])
          chart.dispatchAction({ type: "highlight", seriesId: id });
      }
    };
    const pushReveal = (idx) => {
      const keys = live.handlers.seriesKeys;
      const on = idx !== null;
      chart.setOption(
        {
          series: keys.flatMap((key) => [
            {
              id: key,
              data: on ? sliceToNull(live.revealValues[key] ?? [], idx) : live.revealValues[key] ?? []
            },
            {
              id: `${REVEAL_PREFIX}${key}`,
              // Gray tail keeps only the region from the cursor onward.
              data: on ? sliceFrom(live.revealValues[key] ?? [], idx) : live.revealValues[key] ?? [],
              lineStyle: { opacity: on ? 0.3 : 0 }
            }
          ])
        },
        // NOT lazy: the highlight dispatched just below re-draws the active dot
        // the setOption wipes, so the option must be committed first — a queued
        // (lazy) update would land after the dispatch and erase the dot again.
        { silent: true }
      );
      for (const key of keys) {
        chart.dispatchAction(
          on ? { type: "highlight", seriesId: key, dataIndex: idx } : { type: "downplay", seriesId: key }
        );
      }
    };
    const applyReveal = (event) => {
      const len = live.dataLength;
      if (len < 1) return;
      const x = event.offsetX ?? -1;
      const y = event.offsetY ?? -1;
      if (!chart.containPixel({ gridIndex: 0 }, [x, y])) {
        clearReveal();
        return;
      }
      const raw = chart.convertFromPixel({ gridIndex: 0 }, [x, y])[0];
      const idx = Math.max(0, Math.min(len - 1, Math.round(raw)));
      if (idx === live.revealIndex) return;
      live.revealIndex = idx;
      pushReveal(idx);
    };
    const clearReveal = () => {
      if (live.revealIndex === null) return;
      live.revealIndex = null;
      pushReveal(null);
    };
    const zrHover = chart.getZr();
    const onZrHoverMove = (event) => {
      if (live.handlers.enableHoverReveal) {
        applyReveal(event);
        return;
      }
      if (!live.handlers.enableHoverHighlight) return;
      if (live.handlers.selectedDataKey !== null) return;
      applyHoverKey(
        resolveAreaAtPixel(
          chart,
          live.plottedTops,
          live.handlers.seriesKeys,
          event.offsetX ?? -1,
          event.offsetY ?? -1
        )
      );
    };
    const onZrHoverOut = () => {
      if (live.handlers.enableHoverReveal) clearReveal();
      else if (live.handlers.enableHoverHighlight) applyHoverKey(null);
    };
    zrHover.on("mousemove", onZrHoverMove);
    zrHover.on("globalout", onZrHoverOut);
    chart.on("mouseover", (params) => {
      const { enableHoverHighlight: hoverOn, enableHoverReveal: revealOn } = live.handlers;
      if (!hoverOn || revealOn) return;
      if (live.handlers.selectedDataKey !== null) return;
      const p = params;
      if (p.componentType !== "series" || typeof p.seriesIndex !== "number") return;
      const key = live.seriesKeyByIndex[p.seriesIndex];
      if (!key || key.startsWith("__")) return;
      if (key !== live.hoveredKey) {
        chart.dispatchAction({ type: "downplay", seriesIndex: p.seriesIndex });
        if (live.hoveredKey) {
          chart.dispatchAction({ type: "highlight", seriesId: live.hoveredKey });
        }
      }
    });
    chart.on("datazoom", () => {
      const option = chart.getOption();
      const zoom = option.dataZoom?.[0];
      if (!zoom) return;
      live.brushRange = { start: zoom.start ?? 0, end: zoom.end ?? 100 };
      syncBrushOverlayNow();
      const { onBrushChange: onChange } = live.handlers;
      if (!onChange) return;
      const len = live.dataLength;
      const startIndex = Math.round((zoom.start ?? 0) / 100 * (len - 1));
      const endIndex = Math.round((zoom.end ?? 100) / 100 * (len - 1));
      onChange({ startIndex, endIndex });
    });
    const zr = chart.getZr();
    const applyHover = (next) => {
      const prev = live.brushHover;
      if (prev.inside === next.inside && prev.left === next.left && prev.right === next.right) {
        return;
      }
      live.brushHover = next;
      syncBrushOverlayNow();
    };
    const onZrMove = (event) => {
      const geom = live.brushGeom;
      if (!geom) return;
      const x = event.offsetX ?? -1;
      const y = event.offsetY ?? -1;
      const top = chart.getHeight() - geom.bottom - geom.height;
      const inside = y >= top - 4 && y <= top + geom.height + 4;
      const trackLeft = 8;
      const trackWidth = Math.max(chart.getWidth() - 16, 1);
      const { start, end } = live.brushRange;
      const selectionLeft = trackLeft + trackWidth * start / 100;
      const selectionRight = trackLeft + trackWidth * end / 100;
      applyHover({
        inside,
        left: inside && Math.abs(x - selectionLeft) <= 8,
        right: inside && Math.abs(x - selectionRight) <= 8
      });
    };
    const onZrOut = () => applyHover({ inside: false, left: false, right: false });
    zr.on("mousemove", onZrMove);
    zr.on("globalout", onZrOut);
    return () => {
      zrHover.off("mousemove", onZrHoverMove);
      zrHover.off("globalout", onZrHoverOut);
      zr.off("mousemove", onZrMove);
      zr.off("globalout", onZrOut);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      chart.dispose();
      echartsRef.current = null;
      live.brushOverlay = null;
      live.hasRevealed = false;
    };
  }, [renderer]);
  useEffect(() => {
    const chart = echartsRef.current;
    const container = containerRef.current;
    if (!chart || !container) return;
    live.resolved = resolveColors(container, config, seriesKeys);
    const push = (withEntrance) => {
      const option = buildOption();
      const merged = chartOptions ? { ...option, ...chartOptions } : option;
      Object.assign(merged, {
        animation: withEntrance,
        animationDuration: REVEAL_DURATION,
        animationDurationUpdate: 0
      });
      chart.setOption(merged, { notMerge: true });
      syncBrushOverlayNow();
    };
    if (isLoading) live.hasRevealed = false;
    const shouldReveal = !live.hasRevealed && !isLoading;
    if (shouldReveal) live.hasRevealed = true;
    const revealEnabled = animation && shouldReveal && effectiveAnimation !== "none" && !shouldReduceMotion;
    if (revealEnabled) live.revealEndsAt = performance.now() + REVEAL_DURATION;
    push(revealEnabled);
    live.repush = () => {
      live.resolved = resolveColors(container, config, seriesKeys);
      push(false);
    };
  }, [
    renderer,
    live,
    buildOption,
    chartOptions,
    isLoading,
    animation,
    effectiveAnimation,
    shouldReduceMotion,
    config,
    seriesKeys,
    syncBrushOverlayNow
  ]);
  useEffect(() => {
    const chart = echartsRef.current;
    if (!chart || isLoading) return;
    const animatedKeys = areas.filter((area) => area.strokeVariant === "animated-dashed" && !area.enableBufferLine).map((area) => area.dataKey);
    if (animatedKeys.length === 0 || hasSelection) return;
    let raf = 0;
    let delayTimer;
    const begin = () => {
      const loopStart = performance.now();
      const tick = (now) => {
        const offset = -((now - loopStart) / 1e3 % 1) * 6;
        chart.setOption(
          { series: animatedKeys.map((id) => ({ id, lineStyle: { dashOffset: offset } })) },
          { silent: true, lazyUpdate: true }
        );
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const delay = Math.max(0, live.revealEndsAt - performance.now());
    if (delay > 0) delayTimer = setTimeout(begin, delay + 50);
    else begin();
    return () => {
      if (delayTimer !== void 0) clearTimeout(delayTimer);
      cancelAnimationFrame(raf);
    };
  }, [renderer, live, areas, hasSelection, isLoading]);
  useEffect(() => {
    const chart = echartsRef.current;
    if (!chart || !isLoading) return;
    let raf = 0;
    let lastPhase = 0;
    const start = performance.now();
    const tick = (now) => {
      const phase = ((now - start) / LOADING_ANIMATION_DURATION % 1 + 1) % 1;
      if (phase < lastPhase) live.loadingRows = getLoadingData(loadingPoints);
      lastPhase = phase;
      const foreground = live.resolved?.tokens.foreground ?? "rgba(120, 120, 120, 1)";
      const w = chart.getWidth();
      const h = chart.getHeight();
      if (!w || !h) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const maxT = (w + h) / (2 * w);
      const center = phase * (maxT + 2 * LOADING_SHIMMER_BAND) - LOADING_SHIMMER_BAND;
      const clip = (peak) => new echarts.graphic.LinearGradient(
        0,
        0,
        w,
        w,
        shimmerWindowStops(center, foreground, peak),
        true
      );
      chart.setOption(
        {
          series: [
            {
              id: "__loading",
              data: loadingData(),
              lineStyle: { color: clip(LOADING_STROKE_OPACITY), width: 1 },
              areaStyle: { color: clip(LOADING_SHIMMER_MAX_OPACITY) }
            }
          ]
        },
        { silent: true, lazyUpdate: true }
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [renderer, live, isLoading, loadingPoints, loadingData]);
  const legendStyle = {
    position: "absolute",
    left: 16,
    right: 16,
    pointerEvents: "auto",
    ...legendSlot.verticalAlign === "top" ? { top: 12 } : legendSlot.verticalAlign === "bottom" ? { bottom: showBrush ? brushHeight + 16 : 12 } : { top: "50%", transform: "translateY(-50%)" }
  };
  return <div
    ref={containerRef}
    data-chart={chartId}
    className={`relative flex flex-col text-xs ${className ?? ""}`}
  >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="relative min-h-0 w-full flex-1">
        <div ref={mountRef} className="h-full min-h-0 w-full" />
      </div>

      {legendSlot.present && !isLoading && <LegendOverlay
    seriesKeys={seriesKeys}
    config={config}
    variant={legendSlot.variant}
    align={legendSlot.align}
    verticalAlign={legendSlot.verticalAlign}
    selectedKey={selectedDataKey}
    hoveredKey={hoveredDataKey}
    isClickable={legendSlot.isClickable}
    onToggle={toggleSelection}
    style={legendStyle}
  />}

      {isLoading && <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <motion.div
    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="text-primary bg-background flex items-center justify-center gap-2 rounded-md border px-2 py-0.5 text-sm"
  >
            <div className="border-border border-t-primary h-3 w-3 animate-spin rounded-full border" />
            <span>Loading</span>
          </motion.div>
        </div>}
    </div>;
}
EChartsAreaChart.Area = Area;
EChartsAreaChart.Dot = Dot;
EChartsAreaChart.ActiveDot = ActiveDot;
EChartsAreaChart.XAxis = XAxis;
EChartsAreaChart.YAxis = YAxis;
EChartsAreaChart.Grid = Grid;
EChartsAreaChart.Tooltip = Tooltip;
EChartsAreaChart.Legend = Legend;
EChartsAreaChart.Brush = Brush;
export {
  EChartsAreaChart
};
