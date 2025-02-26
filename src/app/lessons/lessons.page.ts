import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

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
}
