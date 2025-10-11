import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class SignUpPage {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';
  passwordRequirements = {
    length: false,
    special: false
  };

  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }

  loginPage() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  checkPasswordRequirements() {
    // Check password length
    this.passwordRequirements.length = this.password.length >= 6;
    
    // Check for special character
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    this.passwordRequirements.special = specialChars.test(this.password);
  }

  async register() {
    this.loading = true;
    this.error = '';

    // Validate form inputs
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.error = 'All fields are required';
      this.loading = false;
      return;
    }

    // Validate password requirements
    if (!this.passwordRequirements.length || !this.passwordRequirements.special) {
      this.error = 'Password does not meet the requirements';
      this.loading = false;
      return;
    }

    try {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        displayName: `${this.firstName} ${this.lastName}`,
        email: this.email,
        password: this.password,
        passwordConfirm: this.password
      };

      await this.authService.register(userData);
      
      // Firebase auth will automatically sign in the user after registration
      this.router.navigateByUrl('/tabs');
    } catch (error) {
      console.error('Registration error:', error);
      this.error = 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async signInWithGoogle() {
    const loading = await this.loadingCtrl.create({
      message: 'Signing up with Google...'
    });
    
    await loading.present();
    
    try {
      await this.authService.signInWithGoogle();
      await loading.dismiss();
      this.router.navigateByUrl('/tabs');
    } catch (error: any) {
      await loading.dismiss();
      console.error('Google Sign-In error:', error);
      this.error = error.message || 'Google sign-up failed. Please try again.';
    }
  }
}
