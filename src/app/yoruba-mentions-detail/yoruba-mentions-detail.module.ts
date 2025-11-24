import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YorubaMentionsDetailPage } from './yoruba-mentions-detail.page';

const routes: Routes = [
  {
    path: '',
    component: YorubaMentionsDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YorubaMentionsDetailPageModule {}

