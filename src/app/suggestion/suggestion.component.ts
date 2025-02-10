import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SuggestionComponent {
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
