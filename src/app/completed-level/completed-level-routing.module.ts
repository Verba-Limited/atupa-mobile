import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedLevelPage } from './completed-level.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedLevelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedLevelPageRoutingModule {}
