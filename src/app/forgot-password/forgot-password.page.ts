import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ForgotPasswordPage {
  email = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastService: ToastService
  ) {}

  navigateBack() {
    this.navCtrl.back();
  }

  async sendPasswordResetEmail() {
    if (!this.email) {
      this.error = 'Please enter your email address';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      await this.authService.sendPasswordResetEmail(this.email);
      this.success = 'Password reset email sent! Check your inbox.';
      this.toastService.showSuccess('Password reset email sent successfully!');
      
      // Navigate back to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      this.error = error.message || 'Failed to send password reset email. Please try again.';
      this.toastService.showError(this.error);
    } finally {
      this.loading = false;
    }
  }
}
