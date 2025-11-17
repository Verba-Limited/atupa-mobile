import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YorubaStoriesPage } from './yoruba-stories.page';

const routes: Routes = [
  {
    path: '',
    component: YorubaStoriesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YorubaStoriesPageModule {}


