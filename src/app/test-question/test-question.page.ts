import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-test-question',
  templateUrl: './test-question.page.html',
  styleUrls: ['./test-question.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class TestQuestionPage {
  selectedOption: string = '';
  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back();
  }
  onSelectionChange(event: any) {
    this.selectedOption = event.detail.value;
  }
}
