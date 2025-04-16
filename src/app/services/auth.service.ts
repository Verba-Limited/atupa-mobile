import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private pb: PocketBase;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    // this.pb = new PocketBase('http://your-pocketbase-url'); // Replace with your actual PocketBase URL
    this.pb = new PocketBase('http://127.0.0.1:8090');
    
    // Check if user is already logged in
    const storedAuthData = localStorage.getItem('pocketbase_auth');
    if (storedAuthData) {
      const authData = JSON.parse(storedAuthData);
      this.userSubject.next(authData.model);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      this.userSubject.next(authData.record);
      localStorage.setItem('pocketbase_auth', JSON.stringify(authData));
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
      
      // You can optionally auto-verify the user if needed
      // await this.pb.collection('users').confirmVerification(record.id, userData.email);
      
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

  async logout(): Promise<void> {
    this.pb.authStore.clear();
    this.userSubject.next(null);
    localStorage.removeItem('pocketbase_auth');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.pb.authStore.isValid;
  }

  get currentUser(): any {
    return this.userSubject.value;
  }
} 