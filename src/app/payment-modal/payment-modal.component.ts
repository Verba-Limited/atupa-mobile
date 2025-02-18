import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class PaymentModalComponent {
  constructor(private modalCtrl: ModalController, private router: Router) {}

  paymentMethods: PaymentMethod[] = [
    {
      id: 'credpal',
      name: 'Credpal',
      icon: '../../assets/icon/CredPal Logo.svg',
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: '../../assets/icon/Group 63.svg',
    },
  ];

  selectedMethod: string | null = null;

  selectMethod(methodId: string) {
    this.selectedMethod = methodId;
  }

  continue() {
    if (this.selectedMethod) {
      this.modalCtrl.dismiss(this.selectedMethod);
      this.router.navigate(['/payment-successful']);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
