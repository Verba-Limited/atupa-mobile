import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

interface BoardItem {
  amount: number;
  buttonText: string;
  hasVideo: boolean;
}
interface BundleItem {
  title: string;
  icon: string;
  point: string;
}
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

  availableEleke = 0;
  showAdModal = false;

  navigateBack() {
    this.navCtrl.back();
  }
  boardItems: BoardItem[] = [
    { amount: 3, buttonText: 'Watch AD', hasVideo: true },
    { amount: 5, buttonText: '₦5000 Buy', hasVideo: false },
    { amount: 10, buttonText: '₦10000 Buy', hasVideo: false },
  ];

  bundlePack: BundleItem[] = [
    { point: 'x5', title: 'Eleke ', icon: '../../assets/icon/dots.svg' },
    { point: 'x5', title: 'Obi', icon: '../../assets/icon/almond 1.svg' },
    { point: 'x5', title: 'Eyo Owo', icon: '../../assets/icon/coweries.svg' },
    { point: 'x5', title: 'Ami', icon: '../../assets/icon/more 1.svg' },
  ];


  // Existing code...

  onBuyClick(item: BoardItem) {
    if (item.buttonText === 'Watch AD') {
      this.showAdModal = true;
    }
    // Handle other purchase logic if needed
  }

  onAdEnded() {
    this.showAdModal = false;
    this.availableEleke += 3; // Award 3 points after full watch
  }

  onAdDismissed() {
    this.showAdModal = false; // Handle modal close without completion
  }

}
