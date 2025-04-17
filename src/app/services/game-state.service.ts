// filepath: c:\Users\User\Documents\mobilequiz\src\app\services\game-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private gameStateSubject = new BehaviorSubject<any>(null);
  private quizStatesSubject = new BehaviorSubject<any[]>([]);
  
  gameState$ = this.gameStateSubject.asObservable();
  quizStates$ = this.quizStatesSubject.asObservable();
  
  private readonly MAX_SAVED_QUIZZES = 5; // Limit number of saved quizzes

  constructor() {
    this.loadAllGameStates();
  }

  // Update the latest game state and add to quiz states array
  updateGameState(state: any) {
    if (!state || !state.pageFrom) {
      console.error('Invalid game state:', state);
      return;
    }

    // Update the current state for immediate use
    this.gameStateSubject.next(state);
    localStorage.setItem('latestQuizState', JSON.stringify(state));
    
    // Get existing quiz states
    const states = this.getQuizStates();
    
    // Find if this category already exists
    const existingIndex = states.findIndex(quiz => quiz.pageFrom === state.pageFrom);
    
    if (existingIndex >= 0) {
      // Update existing state
      states[existingIndex] = state;
    } else {
      // Add new state
      states.unshift(state); // Add to beginning (newest first)
      
      // Limit the number of saved quizzes
      if (states.length > this.MAX_SAVED_QUIZZES) {
        states.pop(); // Remove oldest
      }
    }
    
    // Save updated states
    localStorage.setItem('quizStates', JSON.stringify(states));
    this.quizStatesSubject.next(states);
  }

  clearGameState() {
    this.gameStateSubject.next(null);
    localStorage.removeItem('latestQuizState');
  }

  // Remove a specific quiz state
  removeQuizState(pageFrom: string) {
    const states = this.getQuizStates();
    const filteredStates = states.filter(quiz => quiz.pageFrom !== pageFrom);
    
    localStorage.setItem('quizStates', JSON.stringify(filteredStates));
    this.quizStatesSubject.next(filteredStates);
    
    // Also update the most recent state if needed
    if (filteredStates.length > 0) {
      this.gameStateSubject.next(filteredStates[0]);
      localStorage.setItem('latestQuizState', JSON.stringify(filteredStates[0]));
    } else {
      this.gameStateSubject.next(null);
      localStorage.removeItem('latestQuizState');
    }
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

  // Load all saved quiz states
  private loadAllGameStates() {
    this.loadGameState(); // Load the latest state
    
    // Load all saved states
    const savedStates = this.getQuizStates();
    this.quizStatesSubject.next(savedStates);
  }

  // Get all saved quiz states
  getQuizStates(): any[] {
    const savedStates = localStorage.getItem('quizStates');
    return savedStates ? JSON.parse(savedStates) : [];
  }
}
