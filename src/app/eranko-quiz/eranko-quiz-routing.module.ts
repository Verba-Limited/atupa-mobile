import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErankoQuizPage } from './eranko-quiz.page';

const routes: Routes = [
  {
    path: '',
    component: ErankoQuizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErankoQuizPageRoutingModule {}
