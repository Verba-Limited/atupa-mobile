import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomeTabPage implements OnInit {
  latestQuizState: any = null;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private gameStateService: GameStateService
  ) {}

  ngOnInit() {
    // Subscribe to game state updates
    this.gameStateService.gameState$.subscribe((state) => {
      this.latestQuizState = state;
      this.cdr.detectChanges();
    });

    // Load the initial state
    this.gameStateService.loadGameState();
  }

  continueQuiz(page: string) {
    // Checking if a saved state exists and matches the current page
    if (this.latestQuizState && this.latestQuizState.pageFrom === page) {
      this.router.navigate(['/quiz-page'], {
        queryParams: {
          page: this.latestQuizState.pageFrom,
          level: this.latestQuizState.currentLevel,
          index: this.latestQuizState.questionIndex,
          score: this.latestQuizState.userCumulativePoint,
        },
      });
    } else {
      this.router.navigate(['/quiz-page'], {
        queryParams: {
          page: page,
          level: 1,
          score: 0,
        },
      });
    }
  }
  // Optional: a method to clear the saved state if the quiz is completed or the user cancels resuming.
  clearQuizState() {
    localStorage.removeItem('latestQuizState');
    this.latestQuizState = null;
  }
  levelsPage(pageName: string) {
    this.router.navigate(['/levels', { page: pageName }]);
  }

  openNoticePage() {
    this.router.navigate(['/notice-page']);
  }

  goToLesson() {
    this.router.navigate(['/tabs/lesson']);
  }

  goToMainLesson(lessonName: string) {
    this.router.navigate(['/lessons', { lesson: lessonName }]);
  }
}
