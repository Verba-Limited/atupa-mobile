import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticePagePage } from './notice-page.page';

const routes: Routes = [
  {
    path: '',
    component: NoticePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticePagePageRoutingModule {}
