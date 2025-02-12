import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { SuggestionComponent } from '../suggestion/suggestion.component';
import { Router } from '@angular/router';
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
    private modalController: ModalController,
    private router: Router
  ) {}

  navigateBack() {
    this.navCtrl.back();
  }

  onSelectionChange(event: any) {
    this.selectedOption = event.detail.value;
    this.showNewContent = true; // Show new-content div
  }

  overlayItems = [
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Eleke',
      subtitle: 'yaa meji',
      badge: '3',
    },
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Obi',
      subtitle: 'yaa onka',
      badge: '2',
    },
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Eyo',
      subtitle: 'idahun',
      badge: '1',
    },
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Ami',
      subtitle: 'alaye',
      badge: '4',
    },
  ];

  async useSuggestion(title: string) {
    if (title === 'Ami') {
      const modal = await this.modalController.create({
        component: SuggestionComponent,
        cssClass: 'custom-modal', // Apply custom styles
        backdropDismiss: true,
        showBackdrop: true,
      });
      await modal.present();
    }
  }

  completedPage() {
    this.router.navigate(['/completed-level']);
  }
}
