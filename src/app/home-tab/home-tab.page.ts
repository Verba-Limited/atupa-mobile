import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { 
  numberQuestions, 
  animalQuestions, 
  fruitQuestions, 
  kingsQuestions, 
  townsQuestions, 
  proverbsQuestions
} from '../data/quizQuestions';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomeTabPage implements OnInit, OnDestroy {
  latestQuizState: any = null;
  savedQuizStates: any[] = [];
  userFirstName: string = '';
  totalPoints: number = 0;
  directLocalStoragePoints: number = 0;
  
  // Store category total points
  categoryTotalPoints: { [key: string]: number } = {
    'onka': 0,
    'eranko': 0,
    'eso': 0,
    'oba-ilu': 0,
    'ilu': 0
  };
  
  private userSubscription: Subscription = new Subscription();
  private quizStatesSubscription: Subscription = new Subscription();
  private totalPointsSubscription: Subscription = new Subscription();
  
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private gameStateService: GameStateService,
    private authService: AuthService
  ) {
    // Calculate total points for each category
    this.calculateCategoryPoints();
  }

  // Calculate the total points available for each quiz category
  calculateCategoryPoints() {
    this.categoryTotalPoints = {
      'onka': this.calculateTotalPointsForQuestions(numberQuestions),
      'eranko': this.calculateTotalPointsForQuestions(animalQuestions),
      'owe': this.calculateTotalPointsForQuestions(proverbsQuestions),
      'eso': this.calculateTotalPointsForQuestions(fruitQuestions),
      'oba-ilu': this.calculateTotalPointsForQuestions(kingsQuestions),
      'ilu': this.calculateTotalPointsForQuestions(townsQuestions)
    };
    
    console.log('Category total points:', this.categoryTotalPoints);
  }
  
  // Calculate total points for a given array of questions
  calculateTotalPointsForQuestions(questions: any[]): number {
    return questions.reduce((sum, question) => sum + (question.points || 0), 0);
  }
  
  // Get total points for a specific category
  getCategoryTotalPoints(category: string): number {
    return this.categoryTotalPoints[category] || 0;
  }

  ngOnInit() {
    // EMERGENCY FIX: Directly get totalPoints from localStorage on initial load
    const pointsStr = localStorage.getItem('totalPoints');
    if (pointsStr) {
      try {
        const points = parseInt(pointsStr);
        console.log('INITIAL LOAD - Reading points directly from localStorage:', points);
        this.totalPoints = points;
      } catch (e) {
        console.error('Error parsing totalPoints from localStorage on init:', e);
      }
    }
    
    // Force initial load of total points directly from localStorage
    this.loadTotalPointsDirectly();
    
    // Subscribe to game state updates
    this.gameStateService.gameState$.subscribe((state) => {
      this.latestQuizState = state;
      this.cdr.detectChanges();
    });

    // Subscribe to quiz states array updates
    this.quizStatesSubscription = this.gameStateService.quizStates$.subscribe((states) => {
      this.savedQuizStates = states;
      this.cdr.detectChanges();
    });
    
    // Get user info from auth service
    this.getUserInfo();
    
    // Subscribe to total points updates as a backup
    this.totalPointsSubscription = this.gameStateService.totalPoints$.subscribe((points) => {
      console.log('Total points subscription updated:', points);
      if (points !== this.totalPoints) {
        this.totalPoints = points;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.quizStatesSubscription) {
      this.quizStatesSubscription.unsubscribe();
    }
    if (this.totalPointsSubscription) {
      this.totalPointsSubscription.unsubscribe();
    }
  }

  getUserInfo() {
    // Try to load from localStorage directly first for immediate display
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.updateUserName(user);
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    }
    
    // Always subscribe to user changes to keep the UI updated
    this.userSubscription = this.authService.user$.subscribe(userData => {
      if (userData) {
        this.updateUserName(userData);
      } else {
        // If user data is null but we have something in localStorage, try to load from there
        const localData = localStorage.getItem('user_data');
        if (localData) {
          try {
            const user = JSON.parse(localData);
            this.updateUserName(user);
          } catch (e) {
            console.error('Error parsing user data in subscription', e);
            this.userFirstName = 'Guest';
          }
        } else {
          this.userFirstName = 'Guest';
        }
      }
    });
  }

  updateUserName(user: any) {
    this.userFirstName = user.firstName || 
                         (user.name ? user.name.split(' ')[0] : null) || 
                         'Guest';
    this.cdr.detectChanges();
    console.log('User name updated to:', this.userFirstName);
  }

  continueQuiz(page: string, level?: number, index?: number, score?: number) {
    // Get the quizState to extract the previousScore if available
    const savedState = this.savedQuizStates.find(state => state.pageFrom === page);
    
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

  // Get an appropriate icon for the quiz category
  getQuizIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'onka': '../../assets/icon/Rectangle 22.svg',
      'eranko': '../../assets/icon/flat.svg',
      'oba-ilu': '../../assets/icon/obailu.svg',
      'ilu': '../../assets/icon/ilu.svg',
      'eso': '../../assets/icon/eso.svg',
      'owe': '../../assets/icon/owe.svg'
    };
    
    return icons[category] || '../../assets/icon/flat.svg';
  }

  // Remove a quiz from saved states
  removeQuiz(event: Event, pageFrom: string) {
    event.stopPropagation(); // Prevent the click from propagating to the parent
    this.gameStateService.removeQuizState(pageFrom);
  }
  
  // Optional: a method to clear all saved quiz states
  clearAllQuizStates() {
    localStorage.removeItem('latestQuizState');
    localStorage.removeItem('quizStates');
    this.latestQuizState = null;
    this.savedQuizStates = [];
    this.cdr.detectChanges();
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

  openNoticePage() {
    this.router.navigate(['/notice-page'], { state: { returnTo: '/tabs/home-tab' } });
  }

  goToLesson() {
    this.router.navigate(['/tabs/lesson']);
  }

  goToMainLesson(lessonName: string) {
    this.router.navigate(['/lessons', { lesson: lessonName }]);
  }

  ionViewWillEnter() {
    console.log('HOME TAB - ionViewWillEnter');
    // Debug localStorage content
    this.debugLocalStorage();
    
    // ALWAYS load points directly from localStorage on every page enter
    this.loadTotalPointsDirectly();
  }

  ionViewDidEnter() {
    console.log('HOME TAB - ionViewDidEnter - THIS RUNS AFTER ANIMATIONS');
    
    // EMERGENCY FIX: Directly set the totalPoints value from localStorage and force DOM update
    const pointsStr = localStorage.getItem('totalPoints');
    if (pointsStr) {
      try {
        const points = parseInt(pointsStr);
        console.log('EMERGENCY FIX - Reading from localStorage:', pointsStr);
        
        // Force the component property to update
        this.totalPoints = points;
        
        // Force Angular to detect changes and update the UI
        this.cdr.detectChanges();
        
        // Double-check the value was set
        console.log('EMERGENCY FIX - totalPoints value after update:', this.totalPoints);
        
        // Also update the service for consistency
        this.gameStateService.forceRefreshTotalPoints();
      } catch (e) {
        console.error('Error parsing totalPoints from localStorage:', e);
      }
    }
  }

  // Debug method to check localStorage contents
  debugLocalStorage() {
    const totalPointsStr = localStorage.getItem('totalPoints');
    console.log('DEBUG - localStorage totalPoints:', totalPointsStr);
    
    try {
      // Check all localStorage keys and values
      console.log('DEBUG - All localStorage items:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          console.log(`${key}: ${value?.substring(0, 50)}${value && value.length > 50 ? '...' : ''}`);
        }
      }
    } catch (e) {
      console.error('Error inspecting localStorage:', e);
    }
  }

  // Directly load total points from localStorage
  loadTotalPointsDirectly() {
    const pointsStr = localStorage.getItem('totalPoints');
    if (pointsStr) {
      try {
        const points = parseInt(pointsStr);
        console.log('DIRECT LOAD from localStorage - totalPoints:', points);
        this.totalPoints = points;
        
        // Also update the BehaviorSubject in the service
        this.gameStateService.forceRefreshTotalPoints();
        
        this.cdr.detectChanges();
      } catch (e) {
        console.error('Error parsing totalPoints from localStorage', e);
      }
    } else {
      console.log('No totalPoints found in localStorage');
      this.totalPoints = 0;
      this.cdr.detectChanges();
    }
  }

  // Debug method to get raw points directly from localStorage
  getRawPoints(): string {
    const pointsStr = localStorage.getItem('totalPoints');
    return pointsStr || '0';
  }
}
