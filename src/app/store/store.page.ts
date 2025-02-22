import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class StorePage {
  constructor(private navCtrl: NavController) {}

  timeFilters = ['Ekele', 'Obi', 'Eyo Owo', 'Ami'];
  currentFilter = 'Ekele';

  navigateBack() {
    this.navCtrl.back();
  }
}
