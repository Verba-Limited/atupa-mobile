import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

interface BoardItem {
  amount: number;
  buttonText: string;
  hasVideo: boolean;
}
interface BundleItem {
  title: string;
  icon: string;
  point: number;
}
@Component({
  selector: 'app-shop-modal',
  templateUrl: './shop-modal.component.html',
  styleUrls: ['./shop-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ShopModalComponent {
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  boardItems: BoardItem[] = [
    { amount: 3, buttonText: 'Watch AD', hasVideo: true },
    { amount: 5, buttonText: '₦5000 Buy', hasVideo: false },
    { amount: 10, buttonText: '₦10000 Buy', hasVideo: false },
  ];

  bundlePack: BundleItem[] = [
    { point: 3, title: 'Eleke ', icon: '../../assets/icon/dots.svg' },
    { point: 5, title: 'Obi', icon: '' },
    { point: 10, title: 'Eyo Owo', icon: '' },
  ];
}
