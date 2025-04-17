import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ChangePasswordPage {
  currentPassword: string = '';
  password: string = '';
  confirmPassword: string = '';
  showCurrentPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  passwordRequirements = {
    length: false,
    special: false
  };

  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordRequirements() {
    // Check password length (at least 6 characters)
    this.passwordRequirements.length = this.password.length >= 6;
    
    // Check for special character
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    this.passwordRequirements.special = specialChars.test(this.password);
  }

  async saveChanges() {
    if (this.loading) return;

    // Validate form inputs
    if (!this.currentPassword) {
      this.presentToast('Current password is required');
      return;
    }

    // Validate password requirements
    this.checkPasswordRequirements();
    if (!this.passwordRequirements.length || !this.passwordRequirements.special) {
      this.presentToast('New password does not meet the requirements');
      return;
    }

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.presentToast('New passwords do not match');
      return;
    }

    try {
      this.loading = true;
      
      // Get current user
      const user = this.authService.currentUser;
      if (!user) {
        throw new Error('User not found');
      }

      // Try to update password with current password verification
      await this.authService.changePassword(this.password, this.currentPassword);
      
      this.presentToast('Password updated successfully', 'success');
      setTimeout(() => {
        this.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('Error changing password:', error);
      // Extract the error message for more user-friendly display
      let errorMessage = 'Failed to update password';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.presentToast(errorMessage);
    } finally {
      this.loading = false;
    }
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }
}
