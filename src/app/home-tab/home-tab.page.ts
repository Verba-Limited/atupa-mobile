import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

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
  private userSubscription: Subscription = new Subscription();
  private quizStatesSubscription: Subscription = new Subscription();
  
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private gameStateService: GameStateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
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

    // Load the initial state
    this.gameStateService.loadGameState();
    
    // Get user info from auth service
    this.getUserInfo();
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.quizStatesSubscription) {
      this.quizStatesSubscription.unsubscribe();
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
    this.router.navigate(['/quiz-page'], {
      queryParams: {
        page: page,
        level: level || 1,
        index: index || 0,
        score: score || 0,
      },
    });
  }

  // Get an appropriate icon for the quiz category
  getQuizIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'onka': '../../assets/icon/Rectangle 22.svg',
      'eranko': '../../assets/icon/flat.svg',
      'oba-ilu': '../../assets/icon/obailu.svg',
      'ilu': '../../assets/icon/Rectangle 22.svg'
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
    this.router.navigate(['/levels', { page: pageName }]);
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
}
