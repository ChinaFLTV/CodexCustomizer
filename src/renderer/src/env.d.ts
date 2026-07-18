/// <reference types="vite/client" />

import type { CodexCustomizerAPI } from '../../preload/index'

declare global {
  interface Window {
    codexCustomizer: CodexCustomizerAPI
  }
}

export {}
