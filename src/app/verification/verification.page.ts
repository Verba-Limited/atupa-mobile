import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class VerificationPage {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }
}
