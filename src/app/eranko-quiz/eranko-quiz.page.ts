import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
export interface Option {
  id: string;
  label: string;
  isChecked?: boolean;
  isCorrect?: boolean;
}
@Component({
  selector: 'app-eranko-quiz',
  templateUrl: './eranko-quiz.page.html',
  styleUrls: ['./eranko-quiz.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class ErankoQuizPage {
  isOptionSelected: boolean = false;
  isWrongAnswer: boolean = false;

  // Mark one option as correct, for example option3 is correct.
  options: Option[] = [
    { id: 'option1', label: 'Ekun', isChecked: false, isCorrect: false },
    { id: 'option2', label: 'Ekete', isChecked: false, isCorrect: false },
    { id: 'option3', label: 'Aja', isChecked: false, isCorrect: true },
    { id: 'option4', label: 'Aja', isChecked: false, isCorrect: false },
  ];

  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back();
  }

  selectOption(selectedOption: Option) {
    // Reset all options first.
    this.options.forEach((option) => (option.isChecked = false));

    // Mark the selected option as checked.
    selectedOption.isChecked = true;

    // Show the new content section.
    this.isOptionSelected = true;

    // Set the wrong answer flag accordingly.
    this.isWrongAnswer = !selectedOption.isCorrect;
  }
}
