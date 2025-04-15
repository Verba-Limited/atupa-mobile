import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class CategoryPage {
  pageFrom: any;

  constructor(
    private navCtrl: NavController,
    private activateRouter: ActivatedRoute
  ) {
    const page = this.activateRouter.snapshot.paramMap.get('page');
  }
  navigateBack() {
    this.navCtrl.back();
  }
  categories = [
    {
      name: 'Alufabeti',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Eyan',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Faweli',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Girama',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Konsonanti',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Oruko',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Owe',
      image: 'assets/icon/Rectangle223.svg',
    },
    {
      name: 'Alufabeti',
      image: 'assets/icon/Rectangle223.svg',
    },
  ];
  openCategory(cat: any) {
    console.log('Selected category:', cat);
  }
  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    // Filter your categories or perform any search logic here
  }
}
