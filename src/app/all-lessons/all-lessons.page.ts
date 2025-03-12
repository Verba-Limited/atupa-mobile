import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-all-lessons',
  templateUrl: './all-lessons.page.html',
  styleUrls: ['./all-lessons.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class AllLessonsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
