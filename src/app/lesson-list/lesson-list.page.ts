import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.page.html',
  styleUrls: ['./lesson-list.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class LessonListPage {
  constructor(private router: Router, private navCtrl: NavController) {}
  LessonsPage() {
    this.router.navigate(['/lessons']);
  }
  navigateBack() {
    this.navCtrl.back();
  }
}
