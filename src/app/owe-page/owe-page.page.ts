import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-owe-page',
  templateUrl: './owe-page.page.html',
  styleUrls: ['./owe-page.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class OwePagePage {
  constructor(private navCtrl: NavController, private router: Router) {}

  navigateBack() {
    this.navCtrl.back();
  }
  options = [
    'Kò sí ẹni tí ó ma gùn ẹṣin tí kò ní ju ìpàkò. Bí kò fẹ ju ìpàkò, ẹṣin tí ó ngùn á jẹ kọjú.',
    'Kò sí ẹni tí ó ma gùn ẹṣin tí kò Agba ki wa loja, ki ori omo tuntun o wo.',
    'Kò sí ẹni tí ó ma gùn ẹṣin tí kò Agba ki wa loja, ki ori omo tuntun o wo.',
    'Kò sí ẹni tí ó ma gùn ẹṣin tí kò Agba ki wa loja, ki ori omo tuntun o wo.',
  ];
}
