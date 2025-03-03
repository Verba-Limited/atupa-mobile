import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-basics',
  templateUrl: './basics.page.html',
  styleUrls: ['./basics.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class BasicsPage {
  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back();
  }
}
