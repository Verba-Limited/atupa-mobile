import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Lesson {
  _id: string;
  id: string;
  categoryId: string;
  title: string;
  description: string;
  content?: string; // Full content only available when fetching individual lesson
  level: number;
  duration: number; // Duration in minutes
  isPopular: boolean;
  isActive: boolean;
  prerequisites: string[];
  mediaFiles: {
    type: 'audio' | 'video' | 'image';
    url: string;
    description?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent: number;
  progress: number; // Percentage completed
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);
  public lessons$ = this.lessonsSubject.asObservable();

  private popularLessonsSubject = new BehaviorSubject<Lesson[]>([]);
  public popularLessons$ = this.popularLessonsSubject.asObservable();

  private currentLessonSubject = new BehaviorSubject<Lesson | null>(null);
  public currentLesson$ = this.currentLessonSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadPopularLessons();
  }

  // Load all lessons with optional filtering
  async loadLessons(params?: {
    categoryId?: string;
    level?: number;
    isPopular?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Lesson[]> {
    try {
      const lessons = await this.apiService.getAllLessons(params).toPromise();
      
      if (!params?.page || params.page === 1) {
        // Only update the subject if it's the first page or no pagination
        this.lessonsSubject.next(lessons || []);
      }
      
      return lessons || [];
    } catch (error) {
      console.error('Failed to load lessons:', error);
      return this.getFallbackLessons(params);
    }
  }

  // Load popular lessons
  async loadPopularLessons(limit: number = 10): Promise<Lesson[]> {
    try {
      const lessons = await this.apiService.getPopularLessons(limit).toPromise();
      this.popularLessonsSubject.next(lessons || []);
      return lessons || [];
    } catch (error) {
      console.error('Failed to load popular lessons:', error);
      return this.getFallbackPopularLessons();
    }
  }

  // Get lessons by category
  async getLessonsByCategory(categoryId: string, params?: {
    level?: number;
    page?: number;
    limit?: number;
  }): Promise<Lesson[]> {
    try {
      const lessons = await this.apiService.getLessonsByCategory(categoryId, params).toPromise();
      return lessons || [];
    } catch (error) {
      console.error('Failed to load category lessons:', error);
      return this.getFallbackLessonsByCategory(categoryId, params?.level);
    }
  }

  // Get lesson by ID with full content
  async getLessonById(id: string): Promise<Lesson | null> {
    try {
      const lesson = await this.apiService.getLessonById(id).toPromise();
      if (lesson) {
        this.currentLessonSubject.next(lesson);
      }
      return lesson;
    } catch (error) {
      console.error('Failed to load lesson:', error);
      return null;
    }
  }

  // Get lessons by level
  async getLessonsByLevel(level: number, categoryId?: string): Promise<Lesson[]> {
    try {
      const lessons = await this.apiService.getLessonsByLevel(level, categoryId).toPromise();
      return lessons || [];
    } catch (error) {
      console.error('Failed to load level lessons:', error);
      return [];
    }
  }

  // Search lessons
  async searchLessons(query: string, page?: number, limit?: number): Promise<Lesson[]> {
    try {
      const lessons = await this.apiService.searchLessons(query, page, limit).toPromise();
      return lessons || [];
    } catch (error) {
      console.error('Failed to search lessons:', error);
      return [];
    }
  }

  // Get lesson statistics
  async getLessonStats(): Promise<any> {
    try {
      const stats = await this.apiService.getLessonStats().toPromise();
      return stats;
    } catch (error) {
      console.error('Failed to load lesson stats:', error);
      return null;
    }
  }

  // Get cached lessons
  getCachedLessons(): Observable<Lesson[]> {
    return this.lessons$;
  }

  // Get cached popular lessons
  getCachedPopularLessons(): Observable<Lesson[]> {
    return this.popularLessons$;
  }

  // Get current lesson
  getCurrentLesson(): Observable<Lesson | null> {
    return this.currentLesson$;
  }

  // Clear current lesson
  clearCurrentLesson(): void {
    this.currentLessonSubject.next(null);
  }

  // Check if backend is available
  async checkBackendAvailability(): Promise<boolean> {
    try {
      await this.apiService.getLessonStats().toPromise();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Fallback data when backend is not available
  private getFallbackLessons(params?: any): Lesson[] {
    const fallbackLessons: Lesson[] = [
      {
        _id: 'lesson-owe-001',
        id: 'lesson-owe-001',
        categoryId: '4',
        title: 'Introduction to Yoruba Proverbs',
        description: 'Learn the basics of Yoruba proverbs and their cultural significance',
        level: 1,
        duration: 30,
        isPopular: true,
        isActive: true,
        prerequisites: [],
        mediaFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'lesson-onka-001',
        id: 'lesson-onka-001',
        categoryId: '1',
        title: 'Yoruba Numbers 1-10',
        description: 'Master the basic Yoruba numbers from one to ten',
        level: 1,
        duration: 25,
        isPopular: true,
        isActive: true,
        prerequisites: [],
        mediaFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'lesson-eranko-001',
        id: 'lesson-eranko-001',
        categoryId: '2',
        title: 'Common Animals in Yoruba',
        description: 'Learn the names of common animals in Yoruba language',
        level: 1,
        duration: 35,
        isPopular: false,
        isActive: true,
        prerequisites: [],
        mediaFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    let filtered = fallbackLessons;

    if (params?.categoryId) {
      filtered = filtered.filter(lesson => lesson.categoryId === params.categoryId);
    }

    if (params?.level) {
      filtered = filtered.filter(lesson => lesson.level === params.level);
    }

    if (params?.isPopular !== undefined) {
      filtered = filtered.filter(lesson => lesson.isPopular === params.isPopular);
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm) ||
        lesson.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  private getFallbackPopularLessons(): Lesson[] {
    return this.getFallbackLessons({ isPopular: true });
  }

  private getFallbackLessonsByCategory(categoryId: string, level?: number): Lesson[] {
    return this.getFallbackLessons({ categoryId, level });
  }

  // Map category names to display names
  getCategoryDisplayName(categoryId: string): string {
    const categoryMap: { [key: string]: string } = {
      '1': 'Numbers (Onka)',
      '2': 'Animals (Eranko)',
      '3': 'Kings (Oba Ilu)',
      '4': 'Proverbs (Owe)',
      '5': 'Towns (Ilu)',
      '6': 'Fruits (Eso)',
      'alphabet': 'Alphabet (Alufabeti)'
    };
    return categoryMap[categoryId] || 'Unknown Category';
  }

  // Format duration for display
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} mins`;
  }

  // Generate lesson URL for navigation
  generateLessonUrl(lesson: Lesson): string {
    return `/lesson/${lesson.id}`;
  }

  // Check if lesson is unlocked based on prerequisites
  isLessonUnlocked(lesson: Lesson, completedLessons: string[] = []): boolean {
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
      return true;
    }
    return lesson.prerequisites.every(prereq => completedLessons.includes(prereq));
  }
}
