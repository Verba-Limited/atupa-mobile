import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class TestPage {
  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back();
  }
}
