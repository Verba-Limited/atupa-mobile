import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { ApiService, AuthTokens } from './api.service';

// Type to better represent our user object
export interface AppUser {
  _id: string;
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  emailVisibility?: boolean;
  isVerified?: boolean;
  subscription?: {
    type: 'free' | 'monthly' | 'yearly';
    status: 'active' | 'inactive' | 'expired' | 'cancelled';
  };
  preferences?: {
    notifications?: boolean;
    sound?: boolean;
    vibration?: boolean;
    language?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  public user$ = this.userSubject.asObservable();
  
  // Mimic authStore with a simple object for compatibility
  private _authStore = {
    isValid: false,
    token: '',
    model: null as AppUser | null,
    onChange: (callback: () => void) => {
      this.user$.subscribe(() => callback());
    }
  };
  
  // Make authStore accessible via a getter method for backward compatibility
  get authStore() {
    return this._authStore;
  }

  constructor(
    private router: Router,
    private platform: Platform,
    private apiService: ApiService
  ) {
    this.initializeGoogleAuth();
    this.loadUserData();
    
    // Subscribe to token changes
    this.apiService.token$.subscribe(token => {
      this._authStore.isValid = !!token;
      this._authStore.token = token || '';
    });
  }

  private async initializeGoogleAuth() {
    if (this.platform.is('capacitor')) {
      await GoogleAuth.initialize({
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }

  private loadUserData(): void {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData && this.apiService.isAuthenticated()) {
        const user = JSON.parse(userData) as AppUser;
        this.setUserData(user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('user_data');
    }
  }

  // Helper to set user data in all required places
  private setUserData(user: AppUser | null): void {
    // Update userSubject
    this.userSubject.next(user);
    
    // Update authStore
    this._authStore.isValid = !!user;
    this._authStore.model = user;
    
    // Update localStorage
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_data');
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }): Promise<AppUser> {
    try {
      const result = await this.apiService.register(userData).toPromise();
      
      if (result?.tokens) {
        this.apiService.setToken(result.tokens);
      }
      
      const user: AppUser = {
        ...result?.user,
        id: result?.user._id || result?.user.id
      };
      
      this.setUserData(user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(email: string, password: string): Promise<AppUser> {
    try {
      const result = await this.apiService.login(email, password).toPromise();
      
      if (result?.tokens) {
        this.apiService.setToken(result.tokens);
      }
      
      const user: AppUser = {
        ...result?.user,
        id: result?.user._id || result?.user.id
      };
      
      this.setUserData(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Google OAuth login
  async signInWithGoogle(): Promise<AppUser> {
    try {
      let result;
      
      if (this.platform.is('capacitor')) {
        // Native Google Sign-In
        result = await GoogleAuth.signIn();
      } else {
        // Web Google Sign-In (fallback)
        throw new Error('Google Sign-In not available in web environment');
      }

      if (!result?.email) {
        throw new Error('Failed to get user information from Google');
      }

      // Send Google auth data to backend
      const authResult = await this.apiService.googleLogin({
        idToken: result.authentication?.idToken,
        email: result.email,
        name: result.name,
        picture: result.imageUrl
      }).toPromise();

      if (authResult?.tokens) {
        this.apiService.setToken(authResult.tokens);
      }

      const user: AppUser = {
        ...authResult?.user,
        id: authResult?.user._id || authResult?.user.id
      };

      this.setUserData(user);
      return user;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  // Sign out from Google
  async signOutFromGoogle(): Promise<void> {
    try {
      if (this.platform.is('capacitor')) {
        await GoogleAuth.signOut();
      }
    } catch (error) {
      console.error('Google Sign-Out error:', error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Call backend logout
      await this.apiService.logout().toPromise();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local data regardless of API call success
      this.apiService.clearToken();
      this.setUserData(null);
      await this.signOutFromGoogle();
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await this.apiService.forgotPassword(email).toPromise();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await this.apiService.resetPassword(token, password).toPromise();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.apiService.changePassword(currentPassword, newPassword).toPromise();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): AppUser | null {
    return this.userSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.apiService.isAuthenticated() && !!this.getCurrentUser();
  }

  // Get user profile (refresh from backend)
  async getUserProfile(): Promise<AppUser> {
    try {
      const profile = await this.apiService.getUserProfile().toPromise();
      const user: AppUser = {
        ...profile,
        id: profile._id || profile.id
      };
      this.setUserData(user);
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<AppUser>): Promise<AppUser> {
    try {
      const updatedProfile = await this.apiService.updateUserProfile(profileData).toPromise();
      const user: AppUser = {
        ...updatedProfile,
        id: updatedProfile._id || updatedProfile.id
      };
      this.setUserData(user);
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<AppUser['preferences']>): Promise<void> {
    try {
      await this.apiService.updateUserPreferences(preferences).toPromise();
      
      // Update local user data
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          preferences: { ...currentUser.preferences, ...preferences }
        };
        this.setUserData(updatedUser);
      }
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const result = await this.apiService.refreshToken().toPromise();
      if (result?.tokens) {
        this.apiService.setToken(result.tokens);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      // If refresh fails, logout user
      await this.logout();
      return false;
    }
  }
}
