import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: ['./policy.page.scss'],
  imports: [FormsModule, IonicModule],
})
export class PolicyPage {
  constructor(private navCntl: NavController) {}

  navigateBack() {
    this.navCntl.back();
  }
}
