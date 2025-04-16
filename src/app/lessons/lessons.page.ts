import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  currentLesson: any;
  pageFrom: any;
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private modalController: ModalController,
    private activatedRouter: ActivatedRoute
  ) {
    const lesson = this.activatedRouter.snapshot.paramMap.get('lesson');
    console.log(`pageFrom: ${lesson}`);
    if (lesson != null) {
      this.currentLesson = lesson;
      this.pageFrom = lesson;
    }
  }


  navigateBack() {
    this.navCtrl.back();
  }
  sectionItem: sectionType[] = [
    {
      id: 1,
      icon: 1,
      durations: 1,
      title: 'Topic overview',
      view: 'view',
      locked: false,
      link: '/basics',
    },
    {
      id: 2,
      icon: 2,
      durations: 2,
      title: 'Fundamentals of the Topic',
      view: 'view',
      locked: true, // <-- Locked
    },
    {
      id: 3,
      icon: 3,
      durations: 3,
      title: 'Lesson 1',
      view: 'view',
      locked: true, // <-- Locked
    },
    {
      id: 4,
      icon: 4,
      durations: 4,
      title: 'Lesson 2',
      view: 'view',
      locked: true, // <-- Locked
    },
    {
      id: 5,
      icon: 5,
      durations: 5,
      title: 'Lesson 3',
      view: 'view',
      locked: true,
    },
    {
      id: 6,
      icon: 6,
      durations: 6,
      title: 'Lesson 4',
      view: 'view',
      locked: true, // <-- Locked
    },
    {
      id: 7,
      icon: 7,
      durations: 7,
      title: 'Summary',
      view: 'view',
      locked: true, // <-- Locked
    },
    {
      id: 8,
      icon: 8,
      durations: 8,
      title: 'Quiz',
      view: 'view',
      locked: true, // <-- Locked
    },
    {
      id: 9,
      icon: 9,
      durations: 9,
      title: 'Topic Certificate',
      view: 'view',
      locked: true, // <-- Locked
    }
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
