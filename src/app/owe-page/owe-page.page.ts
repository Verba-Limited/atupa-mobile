import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { SuggestionComponent } from '../suggestion/suggestion.component';
@Component({
  selector: 'app-owe-page',
  templateUrl: './owe-page.page.html',
  styleUrls: ['./owe-page.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class OwePagePage {
  selectedOption: string = '';
  isOptionSelected: boolean = false;
  showNewContent: boolean = false;

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController
  ) {}

  navigateBack() {
    this.navCtrl.back();
  }

  onSelectionChange(event: any) {
    this.selectedOption = event.detail.value;
    this.showNewContent = true; // Show new-content div
  }

  async useSuggestion(type: 'ileke' | 'obi' | 'eyoOwo' | 'ami') {
    if (type === 'ami') {
      const modal = await this.modalController.create({
        component: SuggestionComponent,
        cssClass: 'custom-modal', // Apply custom styles
        backdropDismiss: true,
        showBackdrop: true,
      });
      await modal.present();
    }
  }
}
