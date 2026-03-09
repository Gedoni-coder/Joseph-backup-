/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ECONOMIC_API_ENDPOINT: string;
  readonly VITE_ECONOMIC_API_ENABLED: string;
  readonly VITE_CHATBOT_BACKEND_URL: string;
  readonly VITE_AUTH_API_BASE: string;
  readonly VITE_ACCOUNTS_API_BASE: string;
  readonly VITE_DEV_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
