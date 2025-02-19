import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.page.html',
  styleUrls: ['./achievement.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class AchievementPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
