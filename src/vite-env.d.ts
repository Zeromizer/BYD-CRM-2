/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_ENCRYPTION_SALT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
