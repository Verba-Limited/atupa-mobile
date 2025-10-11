import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  avatar: string;
  position: number;
  isCurrentUser?: boolean;
  lastActive?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private leaderboardSubject = new BehaviorSubject<LeaderboardUser[]>([]);
  public leaderboard$ = this.leaderboardSubject.asObservable();

  constructor() {
    this.loadLeaderboard();
  }

  private loadLeaderboard(): LeaderboardUser[] {
    const stored = localStorage.getItem('leaderboardData');
    if (stored) {
      const data = JSON.parse(stored);
      // Convert date strings back to Date objects
      const leaderboard = data.map((user: any) => ({
        ...user,
        lastActive: user.lastActive ? new Date(user.lastActive) : new Date()
      }));
      this.leaderboardSubject.next(leaderboard);
      return leaderboard;
    }
    
    // Generate initial sample data if none exists
    const sampleData = this.generateInitialData();
    this.saveLeaderboard(sampleData);
    return sampleData;
  }

  private generateInitialData(): LeaderboardUser[] {
    const sampleNames = ['Funmi', 'John', 'Kunle', 'Adebayo', 'Kemi', 'Tolu', 'Seun', 'Bola', 'Yemi', 'Dare'];
    const avatars = [
      '../../assets/icon/Frame 1.svg',
      '../../assets/icon/Group 596.svg',
      '../../assets/icon/Group 597.svg'
    ];
    
    return sampleNames.map((name, index) => ({
      id: `sample_user_${index + 1}`,
      name,
      points: Math.floor(Math.random() * 2000) + 500, // Random points between 500-2500
      avatar: avatars[index % avatars.length],
      position: index + 1,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
    }));
  }

  private saveLeaderboard(leaderboard: LeaderboardUser[]): void {
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboard));
    this.leaderboardSubject.next(leaderboard);
  }

  // Update user points in the leaderboard
  updateUserPoints(userId: string, points: number, userName?: string, avatar?: string): void {
    const leaderboard = this.loadLeaderboard();
    const existingUserIndex = leaderboard.findIndex(user => user.id === userId);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      leaderboard[existingUserIndex].points = points;
      leaderboard[existingUserIndex].lastActive = new Date();
      if (userName) leaderboard[existingUserIndex].name = userName;
      if (avatar) leaderboard[existingUserIndex].avatar = avatar;
    } else {
      // Add new user
      leaderboard.push({
        id: userId,
        name: userName || 'Anonymous',
        points,
        avatar: avatar || '../../assets/icon/Frame 1.svg',
        position: 0, // Will be recalculated
        isCurrentUser: false,
        lastActive: new Date()
      });
    }
    
    // Re-sort and update positions
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        ...user,
        position: index + 1
      }));
    
    this.saveLeaderboard(sortedLeaderboard);
  }

  // Get user's current position and points
  getUserStats(userId: string): { position: number; points: number } | null {
    const leaderboard = this.loadLeaderboard();
    const user = leaderboard.find(u => u.id === userId);
    return user ? { position: user.position, points: user.points } : null;
  }

  // Get top N users
  getTopUsers(count: number = 10): LeaderboardUser[] {
    const leaderboard = this.loadLeaderboard();
    return leaderboard
      .sort((a, b) => b.points - a.points)
      .slice(0, count);
  }

  // Filter leaderboard by time period
  getFilteredLeaderboard(filter: 'Today' | 'This Week' | 'All Time'): LeaderboardUser[] {
    const leaderboard = this.loadLeaderboard();
    const now = new Date();
    
    let filteredUsers = [...leaderboard];
    
    switch (filter) {
      case 'Today':
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filteredUsers = leaderboard.filter(user => 
          !user.lastActive || user.lastActive >= startOfDay
        );
        break;
      case 'This Week':
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredUsers = leaderboard.filter(user => 
          !user.lastActive || user.lastActive >= startOfWeek
        );
        break;
      case 'All Time':
        // No filtering needed
        break;
    }
    
    // Re-sort and update positions
    return filteredUsers
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        ...user,
        position: index + 1
      }));
  }

  // Clear all leaderboard data (useful for testing)
  clearLeaderboard(): void {
    localStorage.removeItem('leaderboardData');
    this.leaderboardSubject.next([]);
  }
}
