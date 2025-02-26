import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
interface sectioType {
  id: number;
  icon: string | number;
  title: string;
  durations: number;
  view: string;
  locked?: boolean;
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class LessonsPage {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }
  sectionItem: sectioType[] = [
    {
      id: 1,
      icon: 1,
      durations: 1,
      title: 'Basic of owe',
      view: 'view',
      locked: false, // <-- Unlocked
    },
    {
      id: 2,
      icon: 2,
      durations: 2,
      title: 'Foundational of owe',
      view: 'view',
      locked: true, // <-- Locked
    },
    {
      id: 3,
      icon: 3,
      durations: 3,
      title: 'Basic of owe',
      view: 'view',
      locked: true, // <-- Locked
    },
  ];
}
