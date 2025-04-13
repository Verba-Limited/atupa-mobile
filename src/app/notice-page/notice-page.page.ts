import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

interface Badge {
  id: number;
  title: string;
  imageSrc: string;
  unlocked: boolean;
}
@Component({
  selector: 'app-notice-page',
  templateUrl: './notice-page.page.html',
  styleUrls: ['./notice-page.page.scss'],
  imports: [FormsModule, IonicModule, CommonModule],
  standalone: true,
})
export class NoticePagePage implements OnInit {
  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }

  ngOnInit() {}

  badges = [
    {
      id: 1,
      imageSrc: '../../assets/icon/receipt 1.svg',
      title: 'Subscription : Get a monthly plan for 20% discount rate',
    },
    {
      id: 2,
      imageSrc: '../../assets/icon/receipt 1.svg',
      title: 'Subscription : You have 3 days left renew your subscription ',
    },
    {
      id: 3,
      imageSrc: '../../assets/icon/book-open 2.svg',
      title: 'Lesson : Another lesson has been added, name is apejuwe ',
    },
    {
      id: 4,
      imageSrc: '../../assets/icon/file-pen 1.svg',
      title: 'Quiz : Try new excited owe quiz to understand learn yoruba  ',
    },
  ];
}
