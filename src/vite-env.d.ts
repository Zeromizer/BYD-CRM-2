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

// Google API types
declare namespace gapi {
  function load(api: string, callback: () => void): void;

  namespace client {
    function init(config: {
      apiKey: string;
      clientId: string;
      discoveryDocs: string[];
      scope: string;
    }): Promise<void>;
  }

  namespace auth2 {
    function getAuthInstance(): GoogleAuth;

    interface GoogleAuth {
      isSignedIn: {
        get(): boolean;
        listen(callback: (isSignedIn: boolean) => void): string;
      };
      signIn(): Promise<GoogleUser>;
      signOut(): Promise<void>;
      currentUser: {
        get(): GoogleUser;
      };
    }

    interface GoogleUser {
      getBasicProfile(): BasicProfile;
      getAuthResponse(): AuthResponse;
    }

    interface BasicProfile {
      getId(): string;
      getEmail(): string;
      getName(): string;
      getImageUrl(): string;
    }

    interface AuthResponse {
      access_token: string;
    }
  }
}

interface Window {
  gapi: typeof gapi;
}
