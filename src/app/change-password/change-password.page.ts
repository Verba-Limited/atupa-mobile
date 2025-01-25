import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ChangePasswordPage {
  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }
}
