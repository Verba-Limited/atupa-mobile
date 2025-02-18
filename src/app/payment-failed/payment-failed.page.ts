import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.page.html',
  styleUrls: ['./payment-failed.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class PaymentFailedPage {
  constructor(private router: Router) {}

  openHomePage() {
    this.router.navigate(['/home']);
  }
}
