import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface QuizQuestion {
  _id: string;
  id: string;
  categoryId: string;
  categoryName: string;
  levelNumber: number;
  questionNumber: number;
  question: string;
  questionSpeech?: string;
  options: {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
  answer: string;
  explanation: string;
  fullMeaning?: string;
  picture?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizCategory {
  _id: string;
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  totalLevels: number;
  isActive: boolean;
  order: number;
}

export interface QuizAttemptResult {
  quizId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  explanation: string;
  fullMeaning?: string;
  timeSpent: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizBackendService {
  private categoriesSubject = new BehaviorSubject<QuizCategory[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private currentQuizzesSubject = new BehaviorSubject<QuizQuestion[]>([]);
  public currentQuizzes$ = this.currentQuizzesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCategories();
  }

  // Load all quiz categories
  async loadCategories(): Promise<QuizCategory[]> {
    try {
      const categories = await this.apiService.getCategories().toPromise();
      this.categoriesSubject.next(categories || []);
      return categories || [];
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to local data if backend is not available
      return this.getFallbackCategories();
    }
  }

  // Get categories (from cache or load)
  getCategories(): Observable<QuizCategory[]> {
    const currentCategories = this.categoriesSubject.value;
    if (currentCategories.length === 0) {
      this.loadCategories();
    }
    return this.categories$;
  }

  // Get quizzes for a specific category and level
  async getQuizzesByCategory(categoryId: string, level?: number): Promise<QuizQuestion[]> {
    try {
      const quizzes = await this.apiService.getQuizzesByCategory(categoryId, level).toPromise();
      this.currentQuizzesSubject.next(quizzes || []);
      return quizzes || [];
    } catch (error) {
      console.error('Failed to load quizzes:', error);
      // Fallback to local data if backend is not available
      return this.getFallbackQuizzes(categoryId, level);
    }
  }

  // Get a specific quiz by ID
  async getQuizById(id: string): Promise<QuizQuestion | null> {
    try {
      const quiz = await this.apiService.getQuizById(id).toPromise();
      return quiz;
    } catch (error) {
      console.error('Failed to load quiz:', error);
      return null;
    }
  }

  // Submit quiz answer
  async submitAnswer(quizId: string, selectedAnswer: string, timeSpent: number = 0): Promise<QuizAttemptResult> {
    try {
      const result = await this.apiService.submitQuizAnswer(quizId, selectedAnswer, timeSpent).toPromise();
      return result;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }

  // Get random quizzes
  async getRandomQuizzes(categoryId?: string, count: number = 10, level?: number): Promise<QuizQuestion[]> {
    try {
      const quizzes = await this.apiService.getRandomQuizzes(categoryId, count, level).toPromise();
      return quizzes || [];
    } catch (error) {
      console.error('Failed to load random quizzes:', error);
      return [];
    }
  }

  // Get user progress for a category
  async getCategoryProgress(categoryId: string): Promise<any> {
    try {
      const progress = await this.apiService.getCategoryProgress(categoryId).toPromise();
      return progress;
    } catch (error) {
      console.error('Failed to load category progress:', error);
      return null;
    }
  }

  // Update user progress
  async updateProgress(progressData: {
    quizId: string;
    categoryId: string;
    levelNumber: number;
    selectedAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    timeSpent?: number;
  }): Promise<any> {
    try {
      const result = await this.apiService.updateProgress(progressData).toPromise();
      return result;
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<any> {
    try {
      const stats = await this.apiService.getUserStats().toPromise();
      return stats;
    } catch (error) {
      console.error('Failed to load user stats:', error);
      return null;
    }
  }

  // Fallback data when backend is not available
  private getFallbackCategories(): QuizCategory[] {
    return [
      {
        _id: '1',
        id: '1',
        name: 'onka',
        displayName: 'Numbers (Onka)',
        description: 'Learn Yoruba numbers from 1 to 1000 and beyond',
        icon: 'numbers-outline',
        totalLevels: 3,
        isActive: true,
        order: 1
      },
      {
        _id: '2',
        id: '2',
        name: 'eranko',
        displayName: 'Animals (Eranko)',
        description: 'Learn names of animals in Yoruba language',
        icon: 'paw-outline',
        totalLevels: 2,
        isActive: true,
        order: 2
      },
      {
        _id: '3',
        id: '3',
        name: 'oba-ilu',
        displayName: 'Kings (Oba Ilu)',
        description: 'Learn about Yoruba traditional rulers and their kingdoms',
        icon: 'crown-outline',
        totalLevels: 2,
        isActive: true,
        order: 3
      },
      {
        _id: '4',
        id: '4',
        name: 'owe',
        displayName: 'Proverbs (Owe)',
        description: 'Master Yoruba proverbs and their meanings',
        icon: 'book-outline',
        totalLevels: 3,
        isActive: true,
        order: 4
      },
      {
        _id: '5',
        id: '5',
        name: 'ilu',
        displayName: 'Towns (Ilu)',
        description: 'Learn about Yoruba towns and cities',
        icon: 'location-outline',
        totalLevels: 2,
        isActive: true,
        order: 5
      },
      {
        _id: '6',
        id: '6',
        name: 'eso',
        displayName: 'Fruits (Eso)',
        description: 'Learn names of fruits in Yoruba language',
        icon: 'nutrition-outline',
        totalLevels: 2,
        isActive: true,
        order: 6
      }
    ];
  }

  private getFallbackQuizzes(categoryId: string, level?: number): QuizQuestion[] {
    // Import local quiz data as fallback
    const {
      numberQuestions,
      animalQuestions,
      kingsQuestions,
      proverbsQuestions,
      townsQuestions,
      fruitQuestions,
    } = require('../data/quizQuestions');

    let questions: any[] = [];
    
    switch (categoryId) {
      case '1':
        questions = numberQuestions;
        break;
      case '2':
        questions = animalQuestions;
        break;
      case '3':
        questions = kingsQuestions;
        break;
      case '4':
        questions = proverbsQuestions;
        break;
      case '5':
        questions = townsQuestions;
        break;
      case '6':
        questions = fruitQuestions;
        break;
      default:
        questions = numberQuestions;
    }

    if (level) {
      questions = questions.filter((q: any) => q.levelNumber === level);
    }

    return questions.map((q: any) => ({
      ...q,
      _id: q.id,
      difficulty: 'easy' as const
    }));
  }

  // Utility method to check if backend is available
  async checkBackendAvailability(): Promise<boolean> {
    try {
      await this.apiService.getCategories().toPromise();
      return true;
    } catch (error) {
      return false;
    }
  }
}
