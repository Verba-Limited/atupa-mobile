import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ForgotPasswordPage {
  constructor(private navCtrl: NavController, private router: Router) {}
  showPassword = false; // Toggle for password visibility
  password = ''; // Bind password input

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }

  navigateToVerification() {
    this.router.navigate(['/verification']);
  }
}
