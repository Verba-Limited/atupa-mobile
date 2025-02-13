import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ShopModalComponent } from '../shop-modal/shop-modal.component';

@Component({
  selector: 'app-all-level',
  templateUrl: './all-level.page.html',
  styleUrls: ['./all-level.page.scss'],
  imports: [IonicModule, FormsModule],
})
export class AllLevelPage implements OnInit {
  constructor(private modalCntl: ModalController) {}

  ngOnInit() {}

  async openShopModal() {
    const modal = await this.modalCntl.create({
      component: ShopModalComponent,
      cssClass: 'custom-shop-modal',
      backdropDismiss: true,
      showBackdrop: true,
    });
    await modal.present();
  }
}
