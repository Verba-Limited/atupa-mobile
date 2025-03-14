import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonListPage } from './lesson-list.page';

const routes: Routes = [
  {
    path: '',
    component: LessonListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonListPageRoutingModule {}
