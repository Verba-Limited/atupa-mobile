import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YorubaProverbsPage } from './yoruba-proverbs.page';

const routes: Routes = [
  {
    path: '',
    component: YorubaProverbsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YorubaProverbsPageModule {}


