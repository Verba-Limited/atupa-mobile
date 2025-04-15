import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-popular-lesson',
  templateUrl: './popular-lesson.page.html',
  styleUrls: ['./popular-lesson.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PopularLessonPage {
  constructor(
    private navCtrl: NavController,
    private activateRouter: ActivatedRoute
  ) {
    const page = this.activateRouter.snapshot.paramMap.get('page');
  }

  navigateBack() {
    this.navCtrl.back();
  }
  categories = [
    {
      name: 'Alufabeti',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Eyan',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Faweli',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Girama',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Konsonanti',
      image: 'assets/icon/Rectangle223.svg',
    },
  ];
}
