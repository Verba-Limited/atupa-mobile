import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AidPage } from './aid.page';

const routes: Routes = [
  {
    path: '',
    component: AidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AidPageRoutingModule {}
