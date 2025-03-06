import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TrailComponent {
  constructor(private modalController: ModalController) {}
  selectedPlan: 'annually' | 'monthly' = 'annually';
  closeModal() {
    this.modalController.dismiss();
  }

  selectPlan(plan: 'annually' | 'monthly') {
    this.selectedPlan = plan;
  }

  startFreeTrial() {
    // Handle free trial start logic
    console.log(`Starting free trial with ${this.selectedPlan} plan`);
  }

  close() {
    // Handle close modal/page logic
    console.log('Closing subscription page');
  }
}
