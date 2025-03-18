import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
  imports: [IonicModule, RouterModule, FormsModule, CommonModule],
})
export class InvitePage {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }
}
