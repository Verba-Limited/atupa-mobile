import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pay-method',
  templateUrl: './pay-method.page.html',
  styleUrls: ['./pay-method.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class PayMethodPage implements OnInit {
  amount = 50000;
  constructor() {}

  ngOnInit() {}
}
