import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000/api/v1';

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load token from storage on service initialization
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else {
        errorMessage = `Server error: ${error.status}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Generic request method
  private request<T>(method: string, endpoint: string, data?: any, useAuth: boolean = true): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = useAuth ? this.getAuthHeaders() : new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let request: Observable<any>;

    switch (method.toUpperCase()) {
      case 'GET':
        request = this.http.get<ApiResponse<T>>(url, { headers });
        break;
      case 'POST':
        request = this.http.post<ApiResponse<T>>(url, data, { headers });
        break;
      case 'PUT':
        request = this.http.put<ApiResponse<T>>(url, data, { headers });
        break;
      case 'DELETE':
        request = this.http.delete<ApiResponse<T>>(url, { headers });
        break;
      default:
        return throwError(() => new Error(`Unsupported HTTP method: ${method}`));
    }

    return request.pipe(
      retry(1),
      map((response: ApiResponse<T>) => {
        if (response.success) {
          return response.data as T;
        } else {
          throw new Error(response.message || 'Request failed');
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Token management
  setToken(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('tokenExpiry', (Date.now() + tokens.expiresIn * 1000).toString());
    this.tokenSubject.next(tokens.accessToken);
  }

  clearToken(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  }

  // Authentication API methods
  register(userData: any): Observable<{ user: any; tokens: AuthTokens }> {
    return this.request<{ user: any; tokens: AuthTokens }>('POST', '/auth/register', userData, false);
  }

  login(email: string, password: string): Observable<{ user: any; tokens: AuthTokens }> {
    return this.request<{ user: any; tokens: AuthTokens }>('POST', '/auth/login', { email, password }, false);
  }

  googleLogin(authData: any): Observable<{ user: any; tokens: AuthTokens }> {
    return this.request<{ user: any; tokens: AuthTokens }>('POST', '/auth/google-login', authData, false);
  }

  logout(): Observable<any> {
    return this.request('POST', '/auth/logout');
  }

  refreshToken(): Observable<{ tokens: AuthTokens }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.request<{ tokens: AuthTokens }>('POST', '/auth/refresh-token', { refreshToken }, false);
  }

  forgotPassword(email: string): Observable<any> {
    return this.request('POST', '/auth/forgot-password', { email }, false);
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.request('POST', '/auth/reset-password', { token, password }, false);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.request('POST', '/auth/change-password', { currentPassword, newPassword });
  }

  // Quiz API methods
  getCategories(): Observable<any[]> {
    return this.request<any[]>('GET', '/quiz/categories', null, false);
  }

  getQuizzesByCategory(categoryId: string, level?: number, page: number = 1, limit: number = 20): Observable<any[]> {
    let endpoint = `/quiz/category/${categoryId}?page=${page}&limit=${limit}`;
    if (level) {
      endpoint += `&level=${level}`;
    }
    return this.request<any[]>('GET', endpoint, null, false);
  }

  getQuizById(id: string): Observable<any> {
    return this.request<any>('GET', `/quiz/${id}`, null, false);
  }

  submitQuizAnswer(quizId: string, selectedAnswer: string, timeSpent: number = 0): Observable<any> {
    return this.request('POST', '/quiz/submit-answer', { quizId, selectedAnswer, timeSpent });
  }

  getRandomQuizzes(categoryId?: string, count: number = 10, level?: number): Observable<any[]> {
    let endpoint = `/quiz/random?count=${count}`;
    if (categoryId) endpoint += `&categoryId=${categoryId}`;
    if (level) endpoint += `&level=${level}`;
    return this.request<any[]>('GET', endpoint, null, false);
  }

  // User API methods
  getUserProfile(): Observable<any> {
    return this.request('GET', '/users/profile');
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.request('PUT', '/users/profile', profileData);
  }

  updateUserPreferences(preferences: any): Observable<any> {
    return this.request('PUT', '/users/preferences', preferences);
  }

  uploadProfileImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const token = this.tokenSubject.value;
    const headers = new HttpHeaders();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/users/profile/image`, formData, { headers })
      .pipe(
        map((response: ApiResponse<any>) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Upload failed');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Progress API methods
  getUserProgress(): Observable<any> {
    return this.request('GET', '/progress');
  }

  getCategoryProgress(categoryId: string): Observable<any> {
    return this.request('GET', `/progress/category/${categoryId}`);
  }

  updateProgress(progressData: any): Observable<any> {
    return this.request('POST', '/progress/update', progressData);
  }

  getUserStats(): Observable<any> {
    return this.request('GET', '/progress/stats');
  }

  getAttemptHistory(categoryId?: string, page: number = 1, limit: number = 20): Observable<any> {
    let endpoint = `/progress/attempts?page=${page}&limit=${limit}`;
    if (categoryId) endpoint += `&categoryId=${categoryId}`;
    return this.request('GET', endpoint);
  }

  // Leaderboard API methods
  getLeaderboard(): Observable<any[]> {
    return this.request<any[]>('GET', '/leaderboard', null, false);
  }

  // Lesson API methods
  getAllLessons(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    level?: number;
    isPopular?: boolean;
    search?: string;
  }): Observable<any[]> {
    let endpoint = '/content/lessons';
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    return this.request<any[]>('GET', endpoint, null, false);
  }

  getPopularLessons(limit?: number): Observable<any[]> {
    let endpoint = '/content/lessons/popular';
    if (limit) {
      endpoint += `?limit=${limit}`;
    }
    return this.request<any[]>('GET', endpoint, null, false);
  }

  getLessonsByCategory(categoryId: string, params?: {
    level?: number;
    page?: number;
    limit?: number;
  }): Observable<any[]> {
    let endpoint = `/content/lessons/category/${categoryId}`;
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    return this.request<any[]>('GET', endpoint, null, false);
  }

  getLessonById(id: string): Observable<any> {
    return this.request<any>('GET', `/content/lessons/${id}`, null, false);
  }

  getLessonsByLevel(level: number, categoryId?: string): Observable<any[]> {
    let endpoint = `/content/lessons/level/${level}`;
    if (categoryId) {
      endpoint += `?categoryId=${categoryId}`;
    }
    return this.request<any[]>('GET', endpoint, null, false);
  }

  searchLessons(query: string, page?: number, limit?: number): Observable<any[]> {
    let endpoint = `/content/lessons/search?q=${encodeURIComponent(query)}`;
    if (page) endpoint += `&page=${page}`;
    if (limit) endpoint += `&limit=${limit}`;
    return this.request<any[]>('GET', endpoint, null, false);
  }

  getLessonStats(): Observable<any> {
    return this.request<any>('GET', '/content/lessons/stats', null, false);
  }

  // Game State Management API methods
  saveGameState(gameState: any): Observable<any> {
    return this.request<any>('POST', '/progress/game-state', gameState);
  }

  getGameState(): Observable<any> {
    return this.request<any>('GET', '/progress/game-state');
  }

  getAllGameStates(): Observable<any[]> {
    return this.request<any[]>('GET', '/progress/game-states');
  }

  getGameStateByCategory(category: string): Observable<any> {
    return this.request<any>('GET', `/progress/game-state/${category}`);
  }

  deleteGameState(category?: string): Observable<any> {
    const endpoint = category ? `/progress/game-state/${category}` : '/progress/game-state';
    return this.request<any>('DELETE', endpoint);
  }

  // Quiz Progress API methods
  saveQuizProgress(progressData: {
    categoryId: string;
    levelNumber: number;
    totalPoints: number;
    completedLevels: number[];
    highestLevelUnlocked: number;
    gameState?: any;
  }): Observable<any> {
    return this.request<any>('POST', '/progress/quiz-progress', progressData);
  }

  getQuizProgress(): Observable<any> {
    return this.request<any>('GET', '/progress/quiz-progress');
  }

  updateTotalPoints(points: number): Observable<any> {
    return this.request<any>('PUT', '/progress/total-points', { totalPoints: points });
  }

  getTotalPoints(): Observable<{ totalPoints: number }> {
    return this.request<{ totalPoints: number }>('GET', '/progress/total-points');
  }

  updateCompletedLevels(levels: number[]): Observable<any> {
    return this.request<any>('PUT', '/progress/completed-levels', { completedLevels: levels });
  }

  getCompletedLevels(): Observable<{ completedLevels: number[] }> {
    return this.request<{ completedLevels: number[] }>('GET', '/progress/completed-levels');
  }

  updateHighestLevel(level: number): Observable<any> {
    return this.request<any>('PUT', '/progress/highest-level', { highestLevel: level });
  }

  getHighestLevel(): Observable<{ highestLevel: number }> {
    return this.request<{ highestLevel: number }>('GET', '/progress/highest-level');
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
