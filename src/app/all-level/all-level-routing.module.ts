import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllLevelPage } from './all-level.page';

const routes: Routes = [
  {
    path: '',
    component: AllLevelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllLevelPageRoutingModule {}
