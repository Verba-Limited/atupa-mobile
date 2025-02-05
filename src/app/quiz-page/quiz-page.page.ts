import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

export interface Option {
  id: string;
  label: string;
  isChecked?: boolean;
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

  isOptionSelected: boolean = false;
  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }
  // Initialize options with isChecked = false
  options: Option[] = [
    { id: 'option1', label: '643', isChecked: false },
    { id: 'option2', label: '340', isChecked: false },
    { id: 'option3', label: '343', isChecked: false },
    { id: 'option4', label: '443', isChecked: false },
  ];

  // Called when an option is clicked
  selectOption(selectedOption: Option) {
    // Uncheck all options
    this.options.forEach((option) => (option.isChecked = false));
    // Check the selected one
    selectedOption.isChecked = true;
    // Show the next div, etc.
    this.isOptionSelected = true;
  }
}
