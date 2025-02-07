import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwePagePage } from './owe-page.page';

const routes: Routes = [
  {
    path: '',
    component: OwePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwePagePageRoutingModule {}
