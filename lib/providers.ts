// ─────────────────────────────────────────────────────────────────────────────
// PROVIDERS — single source of truth for per-model backend selection
// (Kie.ai / fal.ai / Azure Foundry / Codex CLI), shared by the Settings modal, the
// workflow GenerateNode, and the gallery generation composer.
// ─────────────────────────────────────────────────────────────────────────────
import { IMAGE_MODELS } from "@/lib/modelConfig";

export const PROVIDERS = [
  { id: "kie",   label: "Kie.ai" },
  { id: "fal",   label: "fal.ai" },
  { id: "azure", label: "Azure Foundry" },
  { id: "codex", label: "Codex CLI" },
] as const;

export type ProviderId = (typeof PROVIDERS)[number]["id"];

const STORAGE_KEY = "aiui-model-providers";

export function loadModelProviders(): Record<string, ProviderId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveModelProviders(map: Record<string, ProviderId>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("aiui-providers-changed"));
  } catch { /* noop */ }
}

export function getModelProvider(modelId: string): ProviderId {
  return loadModelProviders()[modelId] ?? "kie";
}

/** Persists the backend for a single model, leaving the others untouched. */
export function setModelProvider(modelId: string, provider: ProviderId) {
  const map = loadModelProviders();
  saveModelProviders({ ...map, [modelId]: provider });
}

/**
 * Models with more than one backend to choose from. Both Azure and Codex are
 * image-only, and Azure additionally needs a per-model deployment configured.
 */
const MULTI_PROVIDER_MODEL_IDS = new Set(
  [
    ...IMAGE_MODELS.filter((m) => !!m.azureSizeMap).map((m) => m.id),
    "gpt-image-2-5-flare",
    "gpt-image-2-5-sunburst",
    "minimax-h3",
  ],
);

const FAL_MODEL_IDS = new Set(["gpt-image-2-5-flare", "gpt-image-2-5-sunburst", "minimax-h3"]);

export function providerSupportsModel(provider: ProviderId, modelId: string): boolean {
  if (provider === "kie") return true;
  if (provider === "fal") return FAL_MODEL_IDS.has(modelId);
  const image = IMAGE_MODELS.find((model) => model.id === modelId);
  return provider === "azure" ? !!image?.azureSizeMap : !!image;
}

export function modelHasProviderChoice(modelId: string): boolean {
  return MULTI_PROVIDER_MODEL_IDS.has(modelId);
}
