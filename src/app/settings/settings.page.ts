import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

interface settingTypes {
  id: number;
  name: string;
  arrow?: string;
  link?: string;
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class SettingsPage {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }

  subPages: settingTypes[] = [
    {
      id: 1,
      name: 'Edit Profile',
      // arrow: 'assets/icon/Rectangle223.svg',
      link: '/edit-profile',
    },
    {
      id: 2,
      name: 'Notification',
      // arrow: 'assets/icon/Rectangle223.svg',
      link: '/notification',
    },
    {
      id: 3,
      name: 'Change Password',
      // arrow: 'assets/icon/Rectangle223.svg',
      link: '/change-password',
    },
    {
      id: 4,
      name: 'Invite a friend',
      // arrow: 'assets/icon/Rectangle223.svg',
      link: '/invite',
    },
    {
      id: 6,
      name: 'Help',
      // arrow: 'assets/icon/Rectangle223.svg',
      link: '/aid',
    },
    {
      id: 7,
      name: 'Privacy Policy ',
      // arrow: 'assets/icon/Rectangle223.svg',
      link: '/policy',
    },
    {
      id: 8,
      name: 'Terms and Condition',
      // arrow: 'assets/icon/Rectangle223.svg',
      link: '/terms',
    },
  ];
}
