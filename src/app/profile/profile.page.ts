import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

interface MenuItem {
  icon: string;
  title: string;
  link?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class ProfilePage {
  constructor() {}

  menuItems: MenuItem[] = [
    {
      icon: '../../assets/icon/chart-simple 1.svg',
      title: 'Leaderboard',
      link: '/leaderboard',
    },
    {
      icon: '../../assets/icon/trophy 1.svg',
      title: 'Achievement',
      link: '/achievement',
    },
    {
      icon: '../../assets/icon/shop 1.svg',
      title: 'Store',
      link: '/store',
    },
    {
      icon: '../../assets/icon/gear 1.svg',
      title: 'Settings',
      link: '/settings',
    },
  ];
}
