import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErankoQuizPageRoutingModule } from './eranko-quiz-routing.module';

import { ErankoQuizPage } from './eranko-quiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErankoQuizPage,
    ErankoQuizPageRoutingModule,
  ],
})
export class ErankoQuizPageModule {}
