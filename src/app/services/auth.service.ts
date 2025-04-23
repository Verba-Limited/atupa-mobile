import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private pb: PocketBase;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();
  
  // Make authStore accessible via a getter method
  get authStore() {
    return this.pb.authStore;
  }

  constructor(
    private router: Router,
    private platform: Platform
  ) {
    // this.pb = new PocketBase('http://your-pocketbase-url'); // Replace with your actual PocketBase URL
    this.pb = new PocketBase('http://127.0.0.1:8090');
    
    // Load user data from localStorage or PocketBase auth store
    this.loadUserData();
    
    // Set up listener for auth store changes
    this.pb.authStore.onChange(() => {
      this.loadUserData();
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

  // Load user data from localStorage or PocketBase auth store
  private loadUserData(): void {
    console.log("AuthService: Loading user data");
    
    // First check if user data is in localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("AuthService: User data loaded from localStorage", parsedUser);
        // Add defaults if first/last name are missing
        if (!parsedUser['firstName']) parsedUser['firstName'] = '';
        if (!parsedUser['lastName']) parsedUser['lastName'] = '';
        
        this.userSubject.next(parsedUser);
        return;
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        localStorage.removeItem('user_data');
      }
    } else {
      console.log("AuthService: No user data found in localStorage");
    }

    // Then check if PocketBase has an active session
    if (this.pb.authStore.isValid) {
      // Get user data from auth store
      const userData = this.pb.authStore.model;
      if (userData) {
        console.log("AuthService: User data loaded from PocketBase", userData);
        
        // Ensure we have firstName and lastName properties
        if (!userData['firstName'] && userData['name']) {
          const nameParts = userData['name'].split(' ');
          userData['firstName'] = nameParts[0] || '';
          userData['lastName'] = nameParts.slice(1).join(' ') || '';
        }
        
        this.userSubject.next(userData);
        // Store in localStorage for persistence
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
    } else {
      console.log("AuthService: PocketBase auth is not valid");
    }
  }

  // Google Sign In
  async signInWithGoogle(): Promise<any> {
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
      
      // Try to authenticate with OAuth2 in PocketBase
      try {
        // Check if user exists and authenticate
        const authData = await this.pb.collection('users').authWithOAuth2({
          provider: 'google',
          code: googleUser.authentication.idToken,
          // Required fields for creating new users
          createData: {
            name: googleUser.name,
            firstName: googleUser.givenName || googleUser.name.split(' ')[0] || '',
            lastName: googleUser.familyName || googleUser.name.split(' ').slice(1).join(' ') || '',
            email: googleUser.email,
            emailVisibility: true,
          }
        });
        
        // Store user data in both BehaviorSubject and localStorage
        this.userSubject.next(authData.record);
        localStorage.setItem('user_data', JSON.stringify(authData.record));
        
        return authData.record;
      } catch (error) {
        console.error('PocketBase OAuth2 authentication error:', error);
        
        // If PocketBase OAuth fails, we can try manual authentication/registration
        // Check if user exists by email
        try {
          const users = await this.pb.collection('users').getList(1, 1, {
            filter: `email="${googleUser.email}"`
          });
          
          if (users.items.length > 0) {
            // User exists, but couldn't authenticate with OAuth
            throw new Error('Google authentication failed. Please try again or use email/password login.');
          } else {
            // User doesn't exist, create a new account
            return this.registerWithGoogle(googleUser);
          }
        } catch (listError) {
          console.error('Error checking for existing user:', listError);
          throw new Error('Authentication failed. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }
  
  // Register a new user with Google profile data
  private async registerWithGoogle(googleUser: any): Promise<any> {
    try {
      // Generate a random secure password
      const randomPassword = Math.random().toString(36).slice(-10) + 
                             Math.random().toString(36).slice(-10) +
                             Math.random().toString(36).slice(-10);
      
      // Create the user in PocketBase
      const data = {
        email: googleUser.email,
        password: randomPassword,
        passwordConfirm: randomPassword,
        name: googleUser.name,
        firstName: googleUser.givenName || googleUser.name.split(' ')[0] || '',
        lastName: googleUser.familyName || googleUser.name.split(' ').slice(1).join(' ') || '',
        emailVisibility: true,
        authProvider: 'google',
        googleId: googleUser.id
      };
      
      // Create new user in PocketBase
      const record = await this.pb.collection('users').create(data);
      
      // Authenticate the new user
      const authData = await this.pb.collection('users').authWithPassword(googleUser.email, randomPassword);
      
      // Store user data
      this.userSubject.next(authData.record);
      localStorage.setItem('user_data', JSON.stringify(authData.record));
      
      return authData.record;
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

  async login(email: string, password: string): Promise<any> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      
      // Store user data in both BehaviorSubject and localStorage
      this.userSubject.next(authData.record);
      localStorage.setItem('user_data', JSON.stringify(authData.record));
      
      return authData.record;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<any> {
    try {
      // Format the data for PocketBase users collection
      const data = {
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        name: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName
      };

      // Create the user in PocketBase
      const record = await this.pb.collection('users').create(data);
      
      return record;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<any> {
    try {
      await this.pb.collection('users').requestPasswordReset(email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async updateUserProfile(userData: any): Promise<any> {
    try {
      // Check if user is logged in and we have their ID
      if (!this.pb.authStore.isValid || !userData.id) {
        throw new Error('User not authenticated or missing ID');
      }

      // Create update object with only the fields we want to update
      const updateData: Record<string, any> = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`
      };

      // If there's a profile image (and it's a string), we can update it too
      if (userData.profileImage && typeof userData.profileImage === 'string') {
        updateData['profileImage'] = userData.profileImage;
      }

      // Update the user record in PocketBase
      const updatedRecord = await this.pb.collection('users').update(userData.id, updateData);
      
      // Update the stored user data
      const currentUser = this.userSubject.value;
      const updatedUser = { ...currentUser, ...updateData };
      
      this.userSubject.next(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async changePassword(newPassword: string, currentPassword?: string): Promise<boolean> {
    try {
      // Check if user is logged in
      if (!this.pb.authStore.isValid) {
        throw new Error('User not authenticated');
      }

      // Access user data directly instead of using model property
      const userData = this.pb.authStore.model;
      const userId = userData?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const email = userData?.['email'];
      if (!email) {
        throw new Error('User email not found');
      }

      console.log('Starting password change process for user:', {
        userId,
        email,
        hasCurrentPassword: !!currentPassword
      });

      // Step 1: Verify current password by authenticating again
      if (!currentPassword) {
        throw new Error('Current password is required');
      }

      try {
        // Re-authenticate with current password to verify it
        await this.pb.collection('users').authWithPassword(email, currentPassword);
        console.log('Current password verified successfully');
      } catch (authError) {
        console.error('Current password verification failed:', authError);
        throw new Error('Current password is incorrect');
      }

      // Step 2: Update the password using the update endpoint
      try {
        console.log('Attempting to update password');
        
        // Save the token for later restoration if needed
        const savedToken = this.pb.authStore.token;
        
        try {
          // Update the user password
          await this.pb.collection('users').update(userId, {
            password: newPassword,
            passwordConfirm: newPassword,
            oldPassword: currentPassword // Some PocketBase configurations require this
          });
          
          console.log('Password updated successfully');
          
          // Re-authenticate with the new password
          this.pb.authStore.clear();
          const authResponse = await this.pb.collection('users').authWithPassword(email, newPassword);
          console.log('Re-authenticated with new password');
          
          // Update the localStorage and userSubject
          localStorage.setItem('user_data', JSON.stringify(authResponse.record));
          this.userSubject.next(authResponse.record);
          
          return true;
        } catch (error: any) {
          console.error('Password update error details:', error);
          
          // Try again with a simpler approach without oldPassword
          if (error.toString().includes('oldPassword')) {
            await this.pb.collection('users').update(userId, {
              password: newPassword,
              passwordConfirm: newPassword
            });
            
            console.log('Password updated successfully with alternative method');
            
            // Re-authenticate with the new password
            this.pb.authStore.clear();
            const authResponse = await this.pb.collection('users').authWithPassword(email, newPassword);
            console.log('Re-authenticated with new password');
            
            // Update the localStorage and userSubject
            localStorage.setItem('user_data', JSON.stringify(authResponse.record));
            this.userSubject.next(authResponse.record);
            
            return true;
          } else {
            throw error; // Re-throw if it's not the oldPassword issue
          }
        }
      } catch (updateError: any) {
        console.error('Failed to update password. Detailed error:', updateError);
        
        // Try to restore the session with the old password
        try {
          this.pb.authStore.clear();
          const authResponse = await this.pb.collection('users').authWithPassword(email, currentPassword);
          console.log('Restored session with old password');
          
          localStorage.setItem('user_data', JSON.stringify(authResponse.record));
          this.userSubject.next(authResponse.record);
        } catch (restoreError) {
          console.error('Failed to restore session:', restoreError);
        }
        
        throw new Error(`Password change failed: ${updateError.message || 'Please try again later.'}`);
      }
    } catch (error) {
      console.error('Error in changePassword method:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Clear PocketBase auth
    this.pb.authStore.clear();
    
    // Clear local user data
    this.userSubject.next(null);
    localStorage.removeItem('user_data');
    
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
    return this.pb.authStore.isValid || localStorage.getItem('user_data') !== null;
  }

  get currentUser(): any {
    return this.userSubject.value;
  }
} 