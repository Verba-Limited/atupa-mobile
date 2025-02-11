import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-completed-level',
  templateUrl: './completed-level.page.html',
  styleUrls: ['./completed-level.page.scss'],
  imports: [IonicModule, FormsModule],
})
export class CompletedLevelPage {
  constructor() {}
}
