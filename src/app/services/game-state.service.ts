// filepath: c:\Users\User\Documents\mobilequiz\src\app\services\game-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private gameStateSubject = new BehaviorSubject<any>(null);
  gameState$ = this.gameStateSubject.asObservable();

  updateGameState(state: any) {
    this.gameStateSubject.next(state);
    localStorage.setItem('latestQuizState', JSON.stringify(state));
  }

  clearGameState() {
    this.gameStateSubject.next(null);
    localStorage.removeItem('latestQuizState');
  }

  loadGameState() {
    const savedState = localStorage.getItem('latestQuizState');
    if (savedState) {
      try {
        this.gameStateSubject.next(JSON.parse(savedState));
      } catch (error) {
        console.error('Error parsing saved quiz state:', error);
        this.gameStateSubject.next(null);
      }
    } else {
      this.gameStateSubject.next(null);
    }
  }

  // Add this method to retrieve the saved states
  getGameStates(): any[] {
    const savedStates = localStorage.getItem('latestQuizStates');
    return savedStates ? JSON.parse(savedStates) : [];
  }
}
