import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-owe-page',
  templateUrl: './owe-page.page.html',
  styleUrls: ['./owe-page.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class OwePagePage {
  selectedOption: string = '';
  showNewContent: boolean = false;

  constructor(private navCtrl: NavController) {}

  navigateBack() {
    this.navCtrl.back();
  }

  onSelectionChange(event: any) {
    this.selectedOption = event.detail.value;
    this.showNewContent = true; // Show new-content div
  }
}
