import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomeTabPage {
  constructor(private router: Router) {}

  levelsPage(pageName: string) {
    this.router.navigate(['/levels', { page: pageName }]);
  }

  openNoticePage() {
    this.router.navigate(['/notice-page']);
  }

  goToLesson() {
    this.router.navigate(['/tabs/lesson']);
  }

  goToMainLesson(lessonName: string) {
    this.router.navigate(['/lessons', { lesson: lessonName }]);
  }

}
