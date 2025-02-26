import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-basics',
  templateUrl: './basics.page.html',
  styleUrls: ['./basics.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class BasicsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
