import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  UserCredential, 
  sendPasswordResetEmail, 
  updatePassword,
  updateProfile,
  User,
  signInWithCredential,
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { environment } from '../../environments/environment';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const auth = getAuth(app);

// Type to better represent our user object
export interface AppUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  emailVisibility?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
    private platform: Platform
  ) {
    // Load user data from localStorage
    this.loadUserData();
    
    // Listen for Firebase auth state changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setUserData(this.mapFirebaseUserToAppUser(user));
      } else {
        // Only clear if we haven't restored from localStorage
        if (this._authStore.isValid) {
          this.setUserData(null);
        }
      }
    });

    // Initialize Google Auth
    this.initGoogleAuth();
  }

  // Initialize Google Auth based on platform
  private async initGoogleAuth(): Promise<void> {
    try {
      // Check if running in browser or native
      const isNative = this.platform.is('capacitor');
      console.log(`Initializing Google Auth for ${isNative ? 'native' : 'web'} platform`);
      
      // Initialize for all platforms (web and native)
      await GoogleAuth.initialize({
        clientId: '13367546245-gldofkock88udfcpr00j5tmm3pmqg5b3.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      console.log('Google Auth initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
    }
  }

  // Try alternative web authentication for browsers with strict security policies
  private async tryWebGoogleAuth(): Promise<any> {
    // This is just a placeholder - in a real implementation, you might:
    // 1. Use a different OAuth flow (like implicit flow with redirects)
    // 2. Use a server-side authentication flow
    // 3. Implement a custom authentication flow using Google's JS SDK directly
    
    // For now, just show an alert and provide guidance
    alert('Google Sign-in may not work properly in this browser due to security settings. Try: \n' +
          '1. Allow popups for this site\n' +
          '2. Use a different browser\n' +
          '3. Use email/password login instead');
          
    throw new Error('Browser security restrictions prevented Google Sign-in');
  }

  // Map Firebase user to our AppUser interface
  private mapFirebaseUserToAppUser(firebaseUser: User): AppUser {
    const displayName = firebaseUser.displayName || '';
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: displayName,
      firstName: firstName, 
      lastName: lastName,
      profileImage: firebaseUser.photoURL || undefined,
      emailVisibility: true
    };
  }

  // Load user data from localStorage
  private loadUserData(): void {
    console.log("AuthService: Loading user data");
    
    // Check if user data is in localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData) as AppUser;
        console.log("AuthService: User data loaded from localStorage", parsedUser);
        
        // Add defaults if first/last name are missing
        if (!parsedUser.firstName) parsedUser.firstName = '';
        if (!parsedUser.lastName) parsedUser.lastName = '';
        
        this.setUserData(parsedUser);
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        localStorage.removeItem('user_data');
        this.setUserData(null);
      }
    } else {
      console.log("AuthService: No user data found in localStorage");
      this.setUserData(null);
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

  // Google Sign In
  async signInWithGoogle(): Promise<AppUser> {
    try {
      console.log('Starting Google Sign In process...');
      
      // Add a delay to ensure any previous auth processes have completed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get Google user with better error handling
      let googleUser;
      try {
        googleUser = await GoogleAuth.signIn();
        console.log('Google user:', googleUser);
      } catch (signInError: any) {
        // Handle specific Google Sign-In errors
        if (signInError.error === 'popup_closed_by_user') {
          console.log('User closed the sign-in popup');
          
          // Check if this might be a browser security issue
          if (!this.platform.is('capacitor') && navigator.userAgent.includes('Chrome/')) {
            // In Chrome with strict security policies, try alternative approach
            console.log('Detected Chrome browser, attempting alternative auth...');
            return this.tryWebGoogleAuth();
          }
          
          throw new Error('Sign-in cancelled. Please try again.');
        }
        
        // Check for Cross-Origin errors which indicate security policy issues
        if (signInError.message && 
            (signInError.message.includes('Cross-Origin') || 
             signInError.message.includes('cross-origin') ||
             signInError.message.includes('blocked by COOP'))) {
          console.log('Detected Cross-Origin issues, trying alternative auth...');
          return this.tryWebGoogleAuth();
        }
        
        // Log and rethrow other errors
        console.error('Google Sign-In failed:', signInError);
        throw new Error('Google sign-in failed: ' + (signInError.message || 'Please try again'));
      }
      
      // Check if we got a valid user object with required fields
      if (!googleUser || !googleUser.authentication || !googleUser.authentication.idToken) {
        console.error('Invalid Google user response:', googleUser);
        throw new Error('Google sign-in returned invalid data');
      }
      
      try {
        // Create credential from the id token
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        
        // Sign in with credential
        const result = await signInWithCredential(auth, credential);
        
        // Map to AppUser
        const appUser = this.mapFirebaseUserToAppUser(result.user);
        
        // Update user data
        this.setUserData(appUser);
        
        return appUser;
      } catch (error: any) {
        console.error('Firebase authentication error:', error);
        
        // Check if the error is because user doesn't exist
        if (error.code === 'auth/user-not-found') {
          return this.registerWithGoogle(googleUser);
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }
  
  // Register a new user with Google profile data
  private async registerWithGoogle(googleUser: any): Promise<AppUser> {
    try {
      // Create credential from the id token
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      
      // Sign in with credential - Firebase will create a new user if needed
      const result = await signInWithCredential(auth, credential);
      
      // Update profile with name if needed
      if (!result.user.displayName && googleUser.name) {
        await updateProfile(result.user, {
          displayName: googleUser.name
        });
      }
      
      // Map to AppUser
      const appUser = this.mapFirebaseUserToAppUser(result.user);
      
      // Store user data
      this.setUserData(appUser);
      
      return appUser;
    } catch (error) {
      console.error('Google registration error:', error);
      throw error;
    }
  }

  // Sign out from Google
  async signOutFromGoogle(): Promise<void> {
    try {
      await GoogleAuth.signOut();
      console.log('Google Sign-Out successful');
    } catch (error) {
      console.error('Google Sign-Out error:', error);
    }
  }

  async login(email: string, password: string): Promise<AppUser> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Map to AppUser
      const appUser = this.mapFirebaseUserToAppUser(result.user);
      
      // Store user data
      this.setUserData(appUser);
      
      return appUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<AppUser> {
    try {
      // Create new user in Firebase
      const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // Update the user's profile with display name
      const displayName = `${userData.firstName} ${userData.lastName}`.trim();
      await updateProfile(result.user, {
        displayName: displayName
      });
      
      // Map to AppUser
      const appUser = this.mapFirebaseUserToAppUser(result.user);
      
      // Add additional fields
      appUser.firstName = userData.firstName;
      appUser.lastName = userData.lastName;
      
      // Store user data
      this.setUserData(appUser);
      
      return appUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async updateUserProfile(userData: any): Promise<AppUser> {
    try {
      // Check if user is logged in
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Create update object
      const displayName = `${userData.firstName} ${userData.lastName}`.trim();
      
      // Update Firebase profile
      await updateProfile(currentUser, {
        displayName: displayName,
        photoURL: userData.profileImage || currentUser.photoURL
      });
      
      // Get updated user data
      const appUser = this.mapFirebaseUserToAppUser(currentUser);
      
      // Add additional fields that aren't in Firebase by default
      appUser.firstName = userData.firstName;
      appUser.lastName = userData.lastName;
      
      // Update stored user data
      this.setUserData(appUser);
      
      return appUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async changePassword(newPassword: string, currentPassword?: string): Promise<boolean> {
    try {
      // Check if user is logged in
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const email = currentUser.email;
      if (!email) {
        throw new Error('User email not found');
      }

      console.log('Starting password change process for user:', {
        userId: currentUser.uid,
        email,
        hasCurrentPassword: !!currentPassword
      });

      // Step 1: Verify current password by re-authenticating
      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      try {
        // Create credential with email and password
        const credential = EmailAuthProvider.credential(email, currentPassword);
        
        // Re-authenticate with current password
        await reauthenticateWithCredential(currentUser, credential);
        console.log('Current password verified successfully');
      } catch (authError) {
        console.error('Current password verification failed:', authError);
        throw new Error('Current password is incorrect');
      }

      // Step 2: Update the password
      try {
        await updatePassword(currentUser, newPassword);
        console.log('Password updated successfully');
        
        // Update stored user data
        const appUser = this.mapFirebaseUserToAppUser(currentUser);
        this.setUserData(appUser);
        
        return true;
      } catch (updateError) {
        console.error('Failed to update password:', updateError);
        throw new Error('Password change failed. Please try again.');
      }
    } catch (error) {
      console.error('Error in changePassword method:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Sign out from Firebase
    await signOut(auth);
    
    // Clear local user data
    this.setUserData(null);
    
    // Try to sign out from Google as well
    try {
      await this.signOutFromGoogle();
    } catch (error) {
      console.error('Error during Google sign-out:', error);
      // Continue with normal logout even if Google sign-out fails
    }
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!auth.currentUser || localStorage.getItem('user_data') !== null;
  }

  get currentUser(): AppUser | null {
    return this.userSubject.value;
  }
} 