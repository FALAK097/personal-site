const BRANDS = {
  openai: { light: "/skills/openai.svg", dark: "/skills/openai-light.svg" },
  anthropic: { light: "/skills/claude.svg", dark: "/skills/claude.svg" },
  gemini: { light: "/skills/gemini.svg", dark: "/skills/gemini.svg" },
  antigravity: { light: "/skills/antigravity.svg", dark: "/skills/antigravity.svg" },
  moonshot: { light: "/skills/moonshotai.svg", dark: "/skills/moonshotai-light.svg" },
  deepseek: { light: "/skills/deepseek.svg", dark: "/skills/deepseek-light.svg" },
  minimax: { light: "/skills/minimax.svg", dark: "/skills/minimax-light.svg" },
  opencode: { light: "/skills/opencode-light.svg", dark: "/skills/opencode-dark.svg" },
  copilot: { light: "/skills/copilot.svg", dark: "/skills/copilot-dark.svg" },
  zai: { light: "/skills/zai.svg", dark: "/skills/zai-light.svg" },
};

// Model families → the brand that serves them.
const MODEL_PATTERNS = [
  [/^(gpt|chatgpt|codex|o1|o3|o4)/i, "openai"],
  [/^claude/i, "anthropic"],
  [/^gemini/i, "gemini"],
  [/^(kimi|moonshot)/i, "moonshot"],
  [/^deepseek/i, "deepseek"],
  [/^minimax/i, "minimax"],
  [/^(glm|zai|z\.ai)/i, "zai"],
];

// Coding clients / agents → their brand.
const CLIENT_BRANDS = {
  openai: "openai",
  codex: "openai",
  chatgpt: "openai",
  anthropic: "anthropic",
  claude: "anthropic",
  opencode: "opencode",
  gemini: "gemini",
  antigravity: "antigravity",
  copilot: "copilot",
  github: "copilot",
  zai: "zai",
  zhipu: "zai",
};

function match(list, value, pick) {
  if (!value) return null;
  const entry = list.find(([pattern]) => pattern.test(value));
  return entry ? pick(entry) : null;
}

export function brandForModel(name) {
  return match(MODEL_PATTERNS, name, (entry) => entry[1]);
}

export function brandForClient(name) {
  if (!name) return null;

  const key = String(name).toLowerCase().trim();
  if (CLIENT_BRANDS[key]) return CLIENT_BRANDS[key];

  // Client names carry suffixes like "antigravity-cli" or "codex-desktop", and
  // some agents are named after the model family they drive.
  const stripped = key.replace(/[-_ ]?(cli|desktop|app|beta|ide)$/i, "");
  if (CLIENT_BRANDS[stripped]) return CLIENT_BRANDS[stripped];

  const prefix = Object.keys(CLIENT_BRANDS).find((candidate) => key.startsWith(candidate));
  if (prefix) return CLIENT_BRANDS[prefix];

  return match(MODEL_PATTERNS, stripped, (entry) => entry[1]);
}

export function brandSrc(brand, isDark) {
  const assets = brand ? BRANDS[brand] : null;
  if (!assets) return null;
  return isDark ? assets.dark : assets.light;
}
