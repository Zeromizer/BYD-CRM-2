import { CONFIG } from '@/shared/constants/config';

/**
 * Consultant/User interface
 */
export interface Consultant {
  id: string;
  email: string;
  name: string;
  picture: string;
}

/**
 * Authentication Service
 * Handles Google OAuth authentication using Google Identity Services (GIS)
 */
export class AuthService {
  private static instance: AuthService;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private accessToken: string | null = null;
  private isInitialized = false;
  private currentConsultant: Consultant | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize Google Identity Services
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      // Check if script already loaded
      if (window.google?.accounts) {
        this.initializeGIS(resolve, reject);
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.initializeGIS(resolve, reject);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services script'));
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Initialize Google Identity Services
   */
  private initializeGIS(resolve: () => void, reject: (error: Error) => void): void {
    try {
      // Initialize OAuth2 token client for Drive access
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.GOOGLE.CLIENT_ID,
        scope: CONFIG.GOOGLE.SCOPES,
        // callback will be set during sign-in
      });

      // Check for existing session
      const stored = sessionStorage.getItem('consultant');
      const storedToken = sessionStorage.getItem('access_token');

      if (stored && storedToken) {
        this.currentConsultant = JSON.parse(stored);
        this.accessToken = storedToken;
      }

      this.isInitialized = true;
      console.log('✅ Google Identity Services initialized');
      resolve();
    } catch (error) {
      console.error('❌ Failed to initialize Google Identity Services:', error);
      reject(
        error instanceof Error
          ? error
          : new Error('Failed to initialize Google Identity Services')
      );
    }
  }

  /**
   * Sign in with Google using One Tap + OAuth2
   */
  async signIn(): Promise<Consultant> {
    if (!this.tokenClient) {
      throw new Error('Google Identity Services not initialized. Call init() first.');
    }

    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('Token client not initialized'));
        return;
      }

      try {
        const tokenClient = this.tokenClient;

        // Use OAuth2 token client to get access token and user info
        tokenClient.callback = async (response: google.accounts.oauth2.TokenResponse) => {
          if (response.error) {
            console.error('❌ OAuth error:', response.error);
            reject(new Error(response.error));
            return;
          }

          // Store access token
          this.accessToken = response.access_token;
          sessionStorage.setItem('access_token', response.access_token);

          try {
            // Fetch user info using access token
            const userInfoResponse = await fetch(
              'https://www.googleapis.com/oauth2/v2/userinfo',
              {
                headers: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              }
            );

            if (!userInfoResponse.ok) {
              throw new Error('Failed to fetch user info');
            }

            const userInfo = await userInfoResponse.json();

            const consultant: Consultant = {
              id: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
            };

            // Store consultant info
            this.currentConsultant = consultant;
            sessionStorage.setItem('consultant', JSON.stringify(consultant));

            console.log('✅ Signed in as:', consultant.email);
            resolve(consultant);
          } catch (error) {
            console.error('❌ Failed to fetch user info:', error);
            reject(new Error('Failed to fetch user info'));
          }
        };

        // Request access token (this will show Google Sign-In popup)
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (error) {
        console.error('❌ Sign in failed:', error);
        reject(error instanceof Error ? error : new Error('Failed to sign in with Google'));
      }
    });
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      // Revoke the access token
      if (this.accessToken) {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      }

      // Clear session
      this.accessToken = null;
      this.currentConsultant = null;
      sessionStorage.removeItem('consultant');
      sessionStorage.removeItem('access_token');

      console.log('✅ Signed out');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      // Still clear local session even if revoke fails
      this.accessToken = null;
      this.currentConsultant = null;
      sessionStorage.removeItem('consultant');
      sessionStorage.removeItem('access_token');
    }
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.currentConsultant !== null && this.accessToken !== null;
  }

  /**
   * Get current consultant from session
   */
  getCurrentConsultant(): Consultant | null {
    if (this.currentConsultant) {
      return this.currentConsultant;
    }

    const stored = sessionStorage.getItem('consultant');
    if (!stored) return null;

    try {
      this.currentConsultant = JSON.parse(stored) as Consultant;
      return this.currentConsultant;
    } catch {
      return null;
    }
  }

  /**
   * Get access token for API calls
   */
  getAccessToken(): string {
    if (this.accessToken) {
      return this.accessToken;
    }

    const stored = sessionStorage.getItem('access_token');
    if (stored) {
      this.accessToken = stored;
      return stored;
    }

    return '';
  }

  /**
   * Listen for auth state changes
   * Note: GIS doesn't provide built-in state change listeners
   * This is a placeholder for compatibility
   */
  onAuthStateChange(callback: (isSignedIn: boolean) => void): () => void {
    // Immediately call with current state
    callback(this.isSignedIn());

    // Return empty cleanup function
    return () => {
      console.log('Auth state listener cleaned up');
    };
  }

  /**
   * Check if auth is initialized
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

/**
 * Export singleton instance
 */
export const authService = AuthService.getInstance();
