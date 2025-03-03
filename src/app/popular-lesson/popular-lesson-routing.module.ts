import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopularLessonPage } from './popular-lesson.page';

const routes: Routes = [
  {
    path: '',
    component: PopularLessonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopularLessonPageRoutingModule {}
