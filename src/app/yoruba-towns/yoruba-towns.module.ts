import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YorubaTownsPage } from './yoruba-towns.page';

const routes: Routes = [
  {
    path: '',
    component: YorubaTownsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YorubaTownsPageModule {}


