import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class TestPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
