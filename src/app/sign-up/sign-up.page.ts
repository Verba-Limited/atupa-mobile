import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class SignUpPage {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }
}
