// filepath: c:\Users\User\Documents\mobilequiz\src\app\services\game-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  numberQuestions,
  animalQuestions,
  kingsQuestions,
  proverbsQuestions,
  townsQuestions,
  fruitQuestions,
} from '../data/quizQuestions';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private gameStateSubject = new BehaviorSubject<any>(null);
  private quizStatesSubject = new BehaviorSubject<any[]>([]);
  private highestLevelUnlockedSubject = new BehaviorSubject<number>(1); // Default to level 1
  private completedLevelsSubject = new BehaviorSubject<number[]>([]);
  private maxAvailableLevelsSubject = new BehaviorSubject<number>(9); // Default
  private totalPointsSubject = new BehaviorSubject<number>(0); // User's total accumulated points
  
  gameState$ = this.gameStateSubject.asObservable();
  quizStates$ = this.quizStatesSubject.asObservable();
  highestLevelUnlocked$ = this.highestLevelUnlockedSubject.asObservable();
  completedLevels$ = this.completedLevelsSubject.asObservable();
  maxAvailableLevels$ = this.maxAvailableLevelsSubject.asObservable();
  totalPoints$ = this.totalPointsSubject.asObservable();
  
  private readonly MAX_SAVED_QUIZZES = 5; // Limit number of saved quizzes

  constructor() {
    this.loadAllGameStates();
    this.loadLevelProgress();
    this.calculateMaxLevels();
    this.loadTotalPoints();
  }

  // Calculate the maximum available levels from quiz question data
  private calculateMaxLevels() {
    const maxLevels = Math.max(
      ...numberQuestions.map(q => q.levelNumber),
      ...animalQuestions.map(q => q.levelNumber || 1),
      ...kingsQuestions.map(q => q.levelNumber || 1),
      ...proverbsQuestions.map(q => q.levelNumber || 1),
      ...townsQuestions.map(q => q.levelNumber || 1)
    );
    
    // Update only if we found a valid level (it should be at least 1)
    if (maxLevels >= 1) {
      this.maxAvailableLevelsSubject.next(maxLevels);
    }
  }

  // Get the maximum available level number
  getMaxAvailableLevels(): number {
    return this.maxAvailableLevelsSubject.getValue();
  }

  // Get maximum levels for a specific category
  getMaxLevelsForCategory(category: string): number {
    let questions;
    switch(category) {
      case 'onka':
        questions = numberQuestions;
        break;
      case 'eranko':
        questions = animalQuestions;
        break;
      case 'eso':
        questions = fruitQuestions;
        break;
      case 'oba-ilu':
        questions = kingsQuestions;
        break;
      case 'owe':
        questions = proverbsQuestions;
        break;
      case 'ilu':
        questions = townsQuestions;
        break;
      default:
        questions = numberQuestions;
    }
    
    // Find the maximum level in the specific category
    const maxLevel = Math.max(...questions.map(q => q.levelNumber || 1));
    return maxLevel;
  }

  // Load level progress from localStorage
  private loadLevelProgress() {
    const highestLevel = localStorage.getItem('highestLevelUnlocked');
    if (highestLevel) {
      this.highestLevelUnlockedSubject.next(parseInt(highestLevel));
    }
    
    const completedLevels = localStorage.getItem('completedLevels');
    if (completedLevels) {
      this.completedLevelsSubject.next(JSON.parse(completedLevels));
    }
  }

  // Load the user's total accumulated points
  private loadTotalPoints() {
    const totalPoints = localStorage.getItem('totalPoints');
    console.log('LOADING totalPoints from localStorage:', totalPoints);
    
    if (totalPoints) {
      try {
        const points = parseInt(totalPoints);
        this.totalPointsSubject.next(points);
        console.log(`Loaded totalPoints from localStorage: ${points}`);
      } catch (e) {
        console.error('Error parsing totalPoints from localStorage:', e);
        // Initialize to 0 if there's an error
        this.totalPointsSubject.next(0);
        localStorage.setItem('totalPoints', '0');
      }
    } else {
      // Initialize totalPoints in localStorage if not present
      console.log('No totalPoints found in localStorage, initializing to 0');
      this.totalPointsSubject.next(0);
      localStorage.setItem('totalPoints', '0');
    }
  }

  // Get the user's total accumulated points
  getTotalPoints(): number {
    return this.totalPointsSubject.getValue();
  }
  
  // Force refresh total points from localStorage
  forceRefreshTotalPoints(): number {
    const totalPoints = localStorage.getItem('totalPoints');
    if (totalPoints) {
      const points = parseInt(totalPoints);
      this.totalPointsSubject.next(points);
      console.log(`Forcefully refreshed totalPoints from localStorage: ${points}`);
      return points;
    } else {
      this.totalPointsSubject.next(0);
      console.log('No totalPoints found in localStorage during force refresh, using default: 0');
      return 0;
    }
  }

  // Add points to the user's total
  addPoints(points: number) {
    if (points <= 0) {
      console.log('No points to add - ignoring call with points:', points);
      return;
    }
    
    const currentTotal = this.totalPointsSubject.getValue();
    console.log('BEFORE adding points - Current total:', currentTotal);
    
    const newTotal = currentTotal + points;
    console.log('AFTER adding points - New total:', newTotal);
    
    // Update the BehaviorSubject with the new total
    this.totalPointsSubject.next(newTotal);
    
    // Save to localStorage
    localStorage.setItem('totalPoints', newTotal.toString());
    console.log(`SAVED to localStorage - totalPoints: ${newTotal}`);
    
    // Double check localStorage was updated correctly
    const savedValue = localStorage.getItem('totalPoints');
    console.log(`VERIFICATION - Read back from localStorage: ${savedValue}`);
  }

  // Add a completed level and unlock the next one
  completeLevel(level: number) {
    // Get current completed levels
    const completedLevels = this.completedLevelsSubject.getValue();
    
    // Add this level to completed levels if not already included
    if (!completedLevels.includes(level)) {
      completedLevels.push(level);
      localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
      this.completedLevelsSubject.next(completedLevels);
      
      // After marking a level as completed, update the quizStates
      // to filter out the completed level
      const states = this.getQuizStates();
      this.quizStatesSubject.next(states);
      
      // Update localStorage with filtered states
      localStorage.setItem('quizStates', JSON.stringify(states));
    }
    
    // Unlock next level
    const currentHighest = this.highestLevelUnlockedSubject.getValue();
    const newHighest = Math.max(currentHighest, level + 1);
    
    localStorage.setItem('highestLevelUnlocked', newHighest.toString());
    this.highestLevelUnlockedSubject.next(newHighest);
    
    console.log(`Level ${level} completed. Next level unlocked: ${newHighest}`);
  }

  // Get the highest unlocked level
  getHighestUnlockedLevel(): number {
    return this.highestLevelUnlockedSubject.getValue();
  }
  
  // Get completed levels
  getCompletedLevels(): number[] {
    return this.completedLevelsSubject.getValue();
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

  // Get all saved quiz states (excluding completed levels)
  getQuizStates(): any[] {
    const savedStates = localStorage.getItem('quizStates');
    let states = savedStates ? JSON.parse(savedStates) : [];
    
    // Filter out any states for levels that have been completed
    const completedLevels = this.getCompletedLevels();
    
    // Keep only quiz states where either:
    // 1. The quiz level is not in completedLevels array
    // 2. Or the level represents the highest level for that category
    //    and is still in progress
    states = states.filter((state: any) => {
      const levelNumber = state.currentLevel ? parseInt(state.currentLevel) : 1;
      const maxLevelForCategory = this.getMaxLevelsForCategory(state.pageFrom);
      
      // If the level is the highest level for the category and it's the max level
      // we should keep it if it's not fully completed
      const isMaxLevel = levelNumber === maxLevelForCategory;
      
      // For completed levels we check if the level is in the completed array
      const isCompleted = completedLevels.includes(levelNumber);
      
      // Keep the state if it's not completed OR
      // if it's the max level for its category (even if partially completed)
      return !isCompleted || (isMaxLevel && state.questionIndex < state.quizQuestions.length);
    });
    
    return states;
  }

  // Get a specific quiz state by page name
  getQuizState(pageName: string): any {
    const states = this.getQuizStates();
    return states.find(state => state.pageFrom === pageName);
  }

  // Load all saved quiz states
  private loadAllGameStates() {
    this.loadGameState(); // Load the latest state
    
    // Load all saved states (filtered by the getQuizStates method)
    const savedStates = this.getQuizStates();
    this.quizStatesSubject.next(savedStates);
  }

  // Reset total points to zero (for debugging purposes)
  resetTotalPoints(reason: string = 'Unknown') {
    console.log(`RESET TOTAL POINTS to zero. Reason: ${reason}`);
    this.totalPointsSubject.next(0);
    localStorage.setItem('totalPoints', '0');
  }
  
  // Track points for each category to avoid double-counting
  getCategoryPoints(categoryName: string): number {
    try {
      const states = this.getQuizStates();
      const categoryState = states.find(state => state.pageFrom === categoryName);
      
      if (categoryState) {
        // Return either previousScore or userCumulativePoint, whichever is available
        // This represents the points that have already been added to the total
        let previousScore = 0;
        
        if (categoryState.previousScore !== undefined) {
          previousScore = categoryState.previousScore;
        } else if (categoryState.userCumulativePoint !== undefined) {
          previousScore = categoryState.userCumulativePoint;
        }
        
        console.log(`Retrieved previous score for ${categoryName}: ${previousScore}`);
        return previousScore;
      }
      return 0;
    } catch (error) {
      console.error(`Error getting points for category ${categoryName}:`, error);
      return 0;
    }
  }
}
