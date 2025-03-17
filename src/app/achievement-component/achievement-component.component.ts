import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-achievement-component',
  templateUrl: './achievement-component.component.html',
  styleUrls: ['./achievement-component.component.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class AchievementComponentComponent implements OnInit {
  @Input() badgeTitle: string = '';
  @Input() badgeImage: string = '';
  showAnimation = false;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    setTimeout(() => {
      this.showAnimation = true;
    }, 300);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
