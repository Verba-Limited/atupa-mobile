import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

interface Badge {
  id: number;
  title: string;
  imageSrc: string;
  unlocked: boolean;
  completed: boolean;
  progress?: number;
}
@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.page.html',
  styleUrls: ['./achievement.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class AchievementPage {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }

  totalAchieved: number = 20;
  totalAchievements: number = 100;

  badges: Badge[] = [
    {
      id: 1,
      title: 'Book Ninja',
      imageSrc: '../../assets/icon/Group 639.svg',
      unlocked: true,
      completed: true,
    },
    {
      id: 2,
      title: 'Star Learner',
      imageSrc: '', // This won't be shown since unlocked is false
      unlocked: false,
      completed: false,
      progress: 60,
    },
    {
      id: 3,
      title: 'Book Ninja',
      imageSrc: '../../assets/icon/Group 639.svg',
      unlocked: true,
      completed: true,
    },
    {
      id: 4,
      title: 'Star Learner',
      imageSrc: '', // This won't be shown since unlocked is false
      unlocked: false,
      completed: false,
      progress: 60,
    },
    {
      id: 5,
      title: 'Book Ninja',
      imageSrc: '../../assets/icon/Group 639.svg',
      unlocked: true,
      completed: true,
    },
    {
      id: 6,
      title: 'Star Learner',
      imageSrc: '', // This won't be shown since unlocked is false
      unlocked: false,
      completed: false,
      progress: 60,
    },
  ];
}
