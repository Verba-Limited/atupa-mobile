import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, FormsModule, CommonModule],
})
export class NotificationPage {
  showNotification: boolean = true;
  allowSound: boolean = true;
  allowVibration: boolean = false;
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }

  // When "Show notification" is toggled
  onShowNotificationChange(event: any) {
    if (!this.showNotification) {
      // If notifications are disabled, also disable sound & vibration
      this.allowSound = false;
      this.allowVibration = false;
    }
  }
}
