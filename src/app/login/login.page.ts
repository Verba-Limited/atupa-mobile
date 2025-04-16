import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
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
    private authService: AuthService
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
}
