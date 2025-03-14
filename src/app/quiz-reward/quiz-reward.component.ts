import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-reward',
  templateUrl: './quiz-reward.component.html',
  styleUrls: ['./quiz-reward.component.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class QuizRewardComponent {
  rewardAmount = 3; // Dynamic reward amount

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}
