import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YorubaSongsDetailPage } from './yoruba-songs-detail.page';

const routes: Routes = [
  {
    path: '',
    component: YorubaSongsDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YorubaSongsDetailPageModule {}

