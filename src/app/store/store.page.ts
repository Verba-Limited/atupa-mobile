import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class StorePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
