import type { Config } from "tailwindcss";

/**
 * The WaveRider family Tailwind preset.
 *
 * Typed as Partial<Config> because a preset supplies only `theme`/`darkMode`/
 * `plugins` — `content` is always the consuming app's responsibility.
 */
declare const wrPreset: Partial<Config>;
export default wrPreset;
