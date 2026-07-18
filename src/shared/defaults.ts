import type { AppSettings } from './types'
import { DEFAULT_PRESET_ID } from './theme-presets'

export const DEFAULT_DEBUGGING_PORT = 9333

export const DEFAULT_GLOBAL_CSS = `/* Global custom CSS — applied after every theme injection.
   Tip: use CSS variables from the active theme:
   --cc-accent, --cc-bg-base, --cc-bg-elevated, --cc-bg-glass,
   --cc-text-primary, --cc-border, --cc-blur, --cc-radius, …

   Example:
   .monaco-workbench {
     border-radius: var(--cc-radius) !important;
   }
*/

`

export const DEFAULT_SETTINGS: AppSettings = {
  locale: 'zh-CN',
  appTheme: 'system',
  codexPath: null,
  debuggingPort: DEFAULT_DEBUGGING_PORT,
  autoInjectOnStart: true,
  lastPresetId: DEFAULT_PRESET_ID,
  globalCustomCss: DEFAULT_GLOBAL_CSS,
  customThemes: [],
  windowBounds: {
    width: 1180,
    height: 760
  }
}
