import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.page.html',
  styleUrls: ['./payment-successful.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class PaymentSuccessfulPage {
  constructor(private router: Router) {}

  goToFailPayment() {
    this.router.navigate(['/payment-failed']);
  }
}
