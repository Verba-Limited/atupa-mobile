import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.page.html',
  styleUrls: ['./levels.page.scss'],
  // standalone: true,
  imports: [IonicModule],
})
export class LevelsPage {
  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }
}
