import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-total-lesson-score',
  templateUrl: './total-lesson-score.component.html',
  styleUrls: ['./total-lesson-score.component.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class TotalLessonScoreComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
