import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YorubaSongsPage } from './yoruba-songs.page';

const routes: Routes = [
  {
    path: '',
    component: YorubaSongsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YorubaSongsPageModule {}


