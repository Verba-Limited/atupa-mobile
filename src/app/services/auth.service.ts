import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged, sendPasswordResetEmail, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

// Type to better represent our user object
export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isNewUser?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  public user$ = this.userSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private auth: Auth
  ) {
    // Initialize Firebase auth state listener
    this.initializeAuth();
  }
    
  private initializeAuth() {
    // Listen to Firebase auth state changes
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        const appUser: AppUser = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || '',
          isNewUser: false
        };
        this.userSubject.next(appUser);
        this.isAuthenticatedSubject.next(true);
        // Also save to localStorage for offline access
        localStorage.setItem('currentUser', JSON.stringify(appUser));
      } else {
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        localStorage.removeItem('currentUser');
      }
    });
  }

  // Email/Password Login
  async loginWithEmail(email: string, password: string): Promise<AppUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      const appUser: AppUser = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        isNewUser: false
      };
      
      return appUser;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Alias for loginWithEmail
  async login(email: string, password: string): Promise<AppUser> {
    return this.loginWithEmail(email, password);
  }

  // Email/Password Registration
  async registerWithEmail(email: string, password: string, displayName: string): Promise<AppUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name
      await updateProfile(user, { displayName: displayName });
      
      const appUser: AppUser = {
        id: user.uid,
        email: user.email || '',
        displayName: displayName,
        photoURL: user.photoURL || '',
        isNewUser: true
      };
      
      return appUser;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Alias for registerWithEmail
  async register(userData: any): Promise<AppUser> {
    return this.registerWithEmail(userData.email, userData.password, userData.displayName || userData.email.split('@')[0]);
  }

  // Google Sign In
  async signInWithGoogle(): Promise<AppUser> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;
      
      const appUser: AppUser = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        isNewUser: false
      };
        
        return appUser;
      } catch (error: any) {
      console.error('Google Sign-In error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // Firebase auth state listener will handle clearing user data
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Get current user
  getCurrentUser(): AppUser | null {
    return this.userSubject.value;
  }

  // Get current user property
  get currentUser(): AppUser | null {
    return this.userSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Update user profile
  async updateProfile(displayName: string, photoURL?: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await updateProfile(user, { 
          displayName: displayName, 
          photoURL: photoURL 
        });
        // Firebase auth state listener will handle updating the user data
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Update password
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user && user.email) {
        // Re-authenticate user first
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
      }
    } catch (error: any) {
      console.error('Update password error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Change password alias
  async changePassword(newPassword: string, currentPassword: string): Promise<void> {
    return this.updatePassword(currentPassword, newPassword);
  }

  // Update user profile alias
  async updateUserProfile(userData: any): Promise<void> {
    return this.updateProfile(userData.displayName, userData.photoURL);
  }

  // Re-authenticate user
  async reauthenticate(password: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }
    } catch (error: any) {
      console.error('Re-authentication error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  // Helper method to convert Firebase errors to user-friendly messages
  private getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completion.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }
} 