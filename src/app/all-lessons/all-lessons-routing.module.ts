import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllLessonsPage } from './all-lessons.page';

const routes: Routes = [
  {
    path: '',
    component: AllLessonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllLessonsPageRoutingModule {}
