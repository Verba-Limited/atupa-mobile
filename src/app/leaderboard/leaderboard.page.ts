import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { GameStateService } from '../services/game-state.service';
import { AuthService, AppUser } from '../services/auth.service';
import { LeaderboardService, LeaderboardUser } from '../services/leaderboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class LeaderboardPage implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private currentUser: AppUser | null = null;
  
  timeFilters = ['Today', 'This Week', 'All Time'];
  currentFilter = 'Today';
  
  topThree: LeaderboardUser[] = [];
  otherUsers: LeaderboardUser[] = [];
  allUsers: LeaderboardUser[] = [];
  isLoading = true;

  constructor(
    private navCtrl: NavController,
    private gameStateService: GameStateService,
    private authService: AuthService,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadLeaderboardData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateBack() {
    this.navCtrl.back();
  }

  private loadCurrentUser() {
    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
        this.updateCurrentUserHighlight();
      })
    );
  }

  private loadLeaderboardData() {
    this.isLoading = true;
    
    // Update current user's points in leaderboard
    this.updateCurrentUserInLeaderboard();
    
    // Apply current filter
    this.applyFilter();
    
    this.isLoading = false;
  }

  private updateCurrentUserInLeaderboard() {
    if (!this.currentUser) return;
    
    const currentUserPoints = this.gameStateService.getTotalPoints();
    this.leaderboardService.updateUserPoints(
      this.currentUser.id,
      currentUserPoints,
      this.currentUser.displayName || 'You',
      this.currentUser.photoURL || '../../assets/icon/Frame 1.svg'
    );
  }

  private updateCurrentUserHighlight() {
    if (!this.currentUser) return;
    this.applyFilter();
  }

  private applyFilter() {
    // Get filtered leaderboard from service
    const filteredUsers = this.leaderboardService.getFilteredLeaderboard(this.currentFilter as any);
    
    // Mark current user
    if (this.currentUser) {
      filteredUsers.forEach(user => {
        user.isCurrentUser = user.id === this.currentUser!.id;
      });
    }
    
    // Split into top 3 and others
    this.topThree = filteredUsers.slice(0, 3);
    this.otherUsers = filteredUsers.slice(3);
    this.allUsers = filteredUsers;
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
  }

  // Method to refresh leaderboard data
  refreshLeaderboard() {
    this.loadLeaderboardData();
  }
}
