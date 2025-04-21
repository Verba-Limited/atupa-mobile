import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { 
  numberQuestions, 
  animalQuestions, 
  fruitQuestions, 
  kingsQuestions, 
  townsQuestions,
  proverbsQuestions 
} from '../data/quizQuestions';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class QuizPage implements OnInit {
  // Store category total points
  categoryTotalPoints: { [key: string]: number } = {
    'onka': 0,
    'eranko': 0,
    'eso': 0,
    'oba-ilu': 0,
    'ilu': 0,
    'owe': 0,
    'apejuwe': 0,
    'akanlo-ede': 0
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Calculate total points for each category
    this.calculateCategoryPoints();
  }

  // Calculate the total points available for each quiz category
  calculateCategoryPoints() {
    this.categoryTotalPoints = {
      'onka': this.calculateTotalPointsForQuestions(numberQuestions),
      'eranko': this.calculateTotalPointsForQuestions(animalQuestions),
      'eso': this.calculateTotalPointsForQuestions(fruitQuestions),
      'oba-ilu': this.calculateTotalPointsForQuestions(kingsQuestions),
      'ilu': this.calculateTotalPointsForQuestions(townsQuestions),
      'owe': this.calculateTotalPointsForQuestions(proverbsQuestions),
      // Default values for categories that may not have question arrays yet
      'apejuwe': 200,
      'akanlo-ede': 200
    };
    
    console.log('Quiz page - Category total points:', this.categoryTotalPoints);
  }
  
  // Calculate total points for a given array of questions
  calculateTotalPointsForQuestions(questions: any[]): number {
    if (!questions || !Array.isArray(questions)) {
      return 0;
    }
    return questions.reduce((sum, question) => sum + (question.points || 0), 0);
  }
  
  // Get total points for a specific category
  getCategoryTotalPoints(category: string): number {
    return this.categoryTotalPoints[category] || 0;
  }

  levelsPage(pageName: string) {
    this.router.navigate(['/levels', { page: pageName }]);
  }
  // erankoPage() {
  //   this.router.navigate(['/eranko-quiz']);
  // }
  // owePage() {
  //   this.router.navigate(['/owe-page']);
  // }
}
