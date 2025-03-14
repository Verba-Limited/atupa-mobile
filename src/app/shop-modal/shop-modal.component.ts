import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { QuizRewardComponent } from '../quiz-reward/quiz-reward.component';

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
    { point: 'x5', title: 'Eleke ', icon: '../../assets/icon/dots.svg' },
    { point: 'x5', title: 'Obi', icon: '../../assets/icon/almond 1.svg' },
    { point: 'x5', title: 'Eyo Owo', icon: '../../assets/icon/coweries.svg' },
    { point: 'x5', title: 'Ami', icon: '../../assets/icon/more 1.svg' },
  ];

  async openPaymentModal() {
    this.modalController.dismiss();

    const modal = await this.modalController.create({
      component: PaymentModalComponent,
      cssClass: 'payment-method-modal',
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handleBehavior: 'none',
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Handle the selected payment method
        console.log('Selected payment method:', result.data);
      }
    });

    return await modal.present();
  }

  async rewardModal() {
    this.modalController.dismiss();

    const modal = await this.modalController.create({
      component: QuizRewardComponent,
    });
    return await modal.present();
  }
}
