import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }

  navigateToForget() {
    this.router.navigate(['/forgot-password']);
  }

  signPage() {
    this.router.navigate(['/sign-up']);
  }

  async openDashboad() {
    this.loading = true;
    this.error = '';
    
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigateByUrl('/tabs');
    } catch (error) {
      console.error('Login error:', error);
      this.error = 'Invalid email or password';
    } finally {
      this.loading = false;
    }
  }

  async signInWithGoogle() {
    const loading = await this.loadingCtrl.create({
      message: 'Signing in with Google...'
    });
    
    await loading.present();
    
    try {
      await this.authService.signInWithGoogle();
      await loading.dismiss();
      this.router.navigateByUrl('/tabs');
    } catch (error: any) {
      await loading.dismiss();
      console.error('Google Sign-In error:', error);
      this.error = error.message || 'Google sign-in failed. Please try again.';
    }
  }
}
