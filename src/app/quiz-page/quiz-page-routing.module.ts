import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizPagePage } from './quiz-page.page';

const routes: Routes = [
  {
    path: '',
    component: QuizPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizPagePageRoutingModule {}
