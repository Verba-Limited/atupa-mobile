import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { TrailComponent } from '../trail/trail.component';
interface sectionType {
  id: number;
  icon: string | number;
  title: string;
  durations: number;
  view: string;
  locked?: boolean;
  link?: string;
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class LessonsPage {
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private modalController: ModalController
  ) {}

  navigateBack() {
    this.navCtrl.back();
  }
  sectionItem: sectionType[] = [
    {
      id: 1,
      icon: 1,
      durations: 1,
      title: 'Basic of owe',
      view: 'view',
      locked: false,
      link: '/basics',
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

  openSection(item: sectionType) {
    if (item.locked) {
      return;
    }

    if (item.link) {
      this.router.navigate([item.link]);
    }
  }
  // basics() {
  //   this.router.navigate(['/basics']);
  // }

  async trailModal() {
    const modal = await this.modalController.create({
      component: TrailComponent,
    });
    await modal.present();
  }
}
