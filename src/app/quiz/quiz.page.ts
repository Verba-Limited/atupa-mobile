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
import { GameStateService } from '../services/game-state.service';

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

  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {}

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
    // Check if there's a saved game state for this category
    const savedState = this.gameStateService.getQuizState(pageName);
    
    if (savedState) {
      // If there's a saved state, continue directly from the quiz
      console.log('Found saved state for', pageName, '- continuing directly');
      this.continueQuiz(
        savedState.pageFrom, 
        savedState.currentLevel, 
        savedState.questionIndex, 
        savedState.userCumulativePoint
      );
    } else {
      // No saved state, go to levels page to select level
      console.log('No saved state for', pageName, '- going to levels page');
      this.router.navigate(['/levels', { page: pageName }]);
    }
  }

  continueQuiz(page: string, level?: number, index?: number, score?: number) {
    // Get the quizState to extract additional details if available
    const savedState = this.gameStateService.getQuizState(page);
    
    // Log for debugging
    console.log('Found saved state:', savedState);
    
    // Ensure we use the correct question index - the question we stopped at
    // If the saved state has a more recent questionIndex, use that instead
    let questionIndex = index;
    if (savedState && savedState.questionIndex) {
      questionIndex = savedState.questionIndex;
      console.log(`Using questionIndex ${questionIndex} from saved state`);
    }
    
    // Use the dedicated method to get category points to ensure consistency
    // This is the historical score that has already been counted in the totalPoints
    const previousScore = this.gameStateService.getCategoryPoints(page);
    
    console.log(`Continuing quiz ${page} with params:
    - Level: ${level || 1}
    - Question Index: ${questionIndex || 0}
    - Score: ${score || 0}
    - Previous Score: ${previousScore}`);
    
    this.router.navigate(['/quiz-page'], {
      queryParams: {
        page: page,
        level: level || 1,
        index: questionIndex || 0,
        score: score || 0,
        previousScore: previousScore
      },
    });
  }
  // erankoPage() {
  //   this.router.navigate(['/eranko-quiz']);
  // }
  // owePage() {
  //   this.router.navigate(['/owe-page']);
  // }
}
