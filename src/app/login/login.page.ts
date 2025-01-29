import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class LoginPage {
  constructor(private navCtrl: NavController, private router: Router) {}
  showPassword = false; // Toggle for password visibility
  password = ''; // Bind password input

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
}
