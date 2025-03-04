import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestQuestionPage } from './test-question.page';

const routes: Routes = [
  {
    path: '',
    component: TestQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestQuestionPageRoutingModule {}
