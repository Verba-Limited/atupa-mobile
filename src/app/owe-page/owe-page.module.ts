import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwePagePageRoutingModule } from './owe-page-routing.module';

import { OwePagePage } from './owe-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwePagePageRoutingModule,
    OwePagePage,
  ],
})
export class OwePagePageModule {}
