import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shop-modal',
  templateUrl: './shop-modal.component.html',
  styleUrls: ['./shop-modal.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ShopModalComponent {
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
