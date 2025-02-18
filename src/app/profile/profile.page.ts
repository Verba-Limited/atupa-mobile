import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

interface iconTypes {
  icon: string;
  title: string;
  chevron: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ProfilePage {
  constructor() {}

  menuItems: iconTypes[] = [
    {
      title: '../../assets/icon/chart-simple 1.svg',
      chevron: '',
      icon: '',
    },
  ];
}
