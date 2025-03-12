import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TrailComponent } from '../trail/trail.component';

@Component({
  selector: 'app-test-question',
  templateUrl: './test-question.page.html',
  styleUrls: ['./test-question.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class TestQuestionPage {
  selectedOption: string = '';
  isOptionSelected: boolean = false;
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private modalController: ModalController
  ) {}

  yorubaProverbs = [
    {
      value: 'option1',
      label: `Kò sí ení tí ó ma gùn eṣin tí kò ní ju ìpàkó. Bí kó fẹ ju ìpàkó, eṣin tí ó ńgùn.`,
    },
    {
      value: 'option2',
      label: `Kò sí ęni tí ó ma gùn ęşin tí kò Agba ki wa loja, ki ori omo titun o wo.`,
    },
    {
      value: 'option3',
      label: `Kò sí ęni tí ó ma gùn ęşin tí kò Agba ki wa loja, ki ori omo titun o wo..`,
    },
    {
      value: 'option4',
      label: `Kò sí ęni tí ó ma gùn ęşin tí kò Agba ki wa loja, ki ori omo titun o wo..`,
    },
  ];
  navigateBack() {
    this.navCtrl.back();
  }
  onSelectionChange(event: any) {
    this.selectedOption = event.detail.value;
  }
}
