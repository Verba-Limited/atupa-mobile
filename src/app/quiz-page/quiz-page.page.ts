import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

export interface Option {
  id: string;
  text: string;
  isChecked: boolean;
}
@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.page.html',
  styleUrls: ['./quiz-page.page.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true, // If using standalone components
})
export class QuizPagePage {
  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }
  isOptionSelected: boolean = false; // Controls visibility

  options = [
    { id: 'option1', label: '643' },
    { id: 'option2', label: '340' },
    { id: 'option3', label: '343' },
    { id: 'option4', label: '443' },
  ];

  onSelectOption() {
    this.isOptionSelected = true; // Hide .quiz-button and show new div
  }
}
