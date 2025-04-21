import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../services/game-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.page.html',
  styleUrls: ['./levels.page.scss'],
  // standalone: true,
  imports: [IonicModule, CommonModule],
})
export class LevelsPage implements OnInit, OnDestroy {
  pageFrom: any;
  highestLevelUnlocked: number = 1; // Default: only level 1 is unlocked
  completedLevels: number[] = []; // Levels that have been completed
  totalLevels: number = 9; // Default value
  levelNumbers: number[] = []; // Will hold the array of level numbers
  
  private levelSubscription: Subscription = new Subscription();
  private completedLevelsSubscription: Subscription = new Subscription();
  private maxLevelsSubscription: Subscription = new Subscription();
  
  constructor(
    private navCtrl: NavController, 
    private router: Router, 
    private activatedRouter: ActivatedRoute,
    private gameStateService: GameStateService) {
      const page = this.activatedRouter.snapshot.paramMap.get('page');
      if (page != null) {
        this.pageFrom = page;
      } 
  }

  ngOnInit() {
    // Subscribe to highest level unlocked
    this.levelSubscription = this.gameStateService.highestLevelUnlocked$
      .subscribe(level => {
        this.highestLevelUnlocked = level;
      });
      
    // Subscribe to completed levels
    this.completedLevelsSubscription = this.gameStateService.completedLevels$
      .subscribe(levels => {
        this.completedLevels = levels;
      });
      
    // Get the max levels for this specific category (pageFrom)
    if (this.pageFrom) {
      this.totalLevels = this.gameStateService.getMaxLevelsForCategory(this.pageFrom);
    } else {
      // If no specific category, subscribe to the max available levels
      this.maxLevelsSubscription = this.gameStateService.maxAvailableLevels$
        .subscribe(maxLevels => {
          this.totalLevels = maxLevels;
          this.generateLevelNumbers();
        });
    }
    
    this.generateLevelNumbers();
  }
  
  // Generate array of level numbers from 1 to totalLevels
  generateLevelNumbers() {
    this.levelNumbers = Array.from({length: this.totalLevels}, (_, i) => i + 1);
  }
  
  ngOnDestroy() {
    // Clean up subscriptions
    this.levelSubscription.unsubscribe();
    this.completedLevelsSubscription.unsubscribe();
    this.maxLevelsSubscription.unsubscribe();
  }

  // Check if a level is unlocked
  isLevelUnlocked(level: number): boolean {
    return level <= this.highestLevelUnlocked;
  }

  // Check if a level has been completed
  isLevelCompleted(level: number): boolean {
    return this.completedLevels.includes(level);
  }

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }

  quizPage() {
    this.router.navigate(['/quiz-page']);
  }

  goToPage(page: string, level: number) {
    if (this.isLevelUnlocked(level)) {
      this.router.navigate(['/quiz-page', { page: page, level: level }]);
    }
  }

  // goToPage (page: string) {
  //   switch (page) {
  //     case 'onka':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'eranko':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       // this.router.navigate(['/eranko-quiz']);
  //       break;
  //     case 'owe':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'oba-ilu':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'ilu':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'akanlo-ede':
  //       this.router.navigate(['/akanlo-ede']);
  //       break;
  //     case 'apejuwe':
  //       this.router.navigate(['/apejuwe']);
  //       break;
  //     default:
  //       this.router.navigate(['/home']);
  //       break;
  //   }
  // }

}
