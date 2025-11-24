import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YorubaMentionsPage } from './yoruba-mentions.page';

const routes: Routes = [
  {
    path: '',
    component: YorubaMentionsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YorubaMentionsPageModule {}

