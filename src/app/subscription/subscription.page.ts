import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class SubscriptionPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
