import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestQuestionPageRoutingModule } from './test-question-routing.module';

import { TestQuestionPage } from './test-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestQuestionPage,
    TestQuestionPageRoutingModule,
  ],
})
export class TestQuestionPageModule {}
