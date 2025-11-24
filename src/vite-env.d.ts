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

// Google Identity Services types
declare namespace google {
  namespace accounts {
    namespace id {
      interface IdConfiguration {
        client_id: string;
        callback?: (response: CredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }

      interface CredentialResponse {
        credential: string;
        select_by: string;
      }

      interface PromptMomentNotification {
        isDisplayMoment(): boolean;
        isDisplayed(): boolean;
        isNotDisplayed(): boolean;
        getNotDisplayedReason(): string;
        isSkippedMoment(): boolean;
        getSkippedReason(): string;
        isDismissedMoment(): boolean;
        getDismissedReason(): string;
        getMomentType(): string;
      }

      function initialize(config: IdConfiguration): void;
      function prompt(callback?: (notification: PromptMomentNotification) => void): void;
      function renderButton(parent: HTMLElement, options: GsiButtonConfiguration): void;
      function disableAutoSelect(): void;
      function storeCredential(credential: { id: string; password: string }): void;
      function cancel(): void;
      function revoke(email: string, callback: (response: RevocationResponse) => void): void;
    }

    namespace oauth2 {
      interface TokenClient {
        callback: (response: TokenResponse) => void;
        requestAccessToken(overrideConfig?: OverridableTokenClientConfig): void;
      }

      interface TokenResponse {
        access_token: string;
        expires_in: number;
        hd?: string;
        prompt: string;
        token_type: string;
        scope: string;
        error?: string;
        error_description?: string;
        error_uri?: string;
      }

      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback?: (response: TokenResponse) => void;
        error_callback?: (error: Error) => void;
        prompt?: string;
        enable_serial_consent?: boolean;
        hint?: string;
        hosted_domain?: string;
      }

      interface OverridableTokenClientConfig {
        scope?: string;
        prompt?: string;
        enable_serial_consent?: boolean;
        hint?: string;
        state?: string;
      }

      interface RevocationResponse {
        successful: boolean;
        error?: string;
        error_description?: string;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
      function hasGrantedAllScopes(tokenResponse: TokenResponse, ...scopes: string[]): boolean;
      function hasGrantedAnyScope(tokenResponse: TokenResponse, ...scopes: string[]): boolean;
      function revoke(token: string, callback?: () => void): void;
    }
  }
}

interface GsiButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

interface Window {
  google?: typeof google;
}
