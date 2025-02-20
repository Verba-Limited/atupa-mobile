import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

interface LeaderboardUser {
  id: number;
  name: string;
  points: number;
  avatar: string;
  position: number;
  isCurrentUser?: boolean;
}
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class LeaderboardPage {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }

  timeFilters = ['Today', 'This Week', 'All Time'];
  currentFilter = 'Today';

  // Sample data - replace with your actual data
  topThree: LeaderboardUser[] = [
    {
      id: 1,
      name: 'Funmi',
      points: 2000,
      avatar: '../../assets/icon/Frame 1.svg',
      position: 1,
    },
    {
      id: 2,
      name: 'John',
      points: 1600,
      avatar: '../../assets/icon/Group 596.svg',
      position: 2,
    },
    {
      id: 3,
      name: 'Kunle',
      points: 1300,
      avatar: '../../assets/icon/Group 597.svg',
      position: 3,
      isCurrentUser: true,
    },
  ];

  otherUsers: LeaderboardUser[] = [
    {
      id: 4,
      name: 'John',
      points: 1600,
      avatar: '../../assets/icon/Group 596.svg',
      position: 4,
    },
    {
      id: 5,
      name: 'John',
      points: 1600,
      avatar: '../../assets/icon/Group 596.svg',
      position: 5,
    },
    {
      id: 5,
      name: 'John',
      points: 1600,
      avatar: '../../assets/icon/Group 596.svg',
      position: 5,
    },
    {
      id: 5,
      name: 'John',
      points: 1600,
      avatar: '../../assets/icon/Group 596.svg',
      position: 5,
    },
    {
      id: 5,
      name: 'John',
      points: 1600,
      avatar: '../../assets/icon/Group 596.svg',
      position: 5,
    },
  ];

  setFilter(filter: string) {
    this.currentFilter = filter;
    // Add your filter logic here
  }
}
