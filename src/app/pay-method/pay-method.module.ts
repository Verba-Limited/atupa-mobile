import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayMethodPageRoutingModule } from './pay-method-routing.module';

import { PayMethodPage } from './pay-method.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayMethodPage,
    PayMethodPageRoutingModule,
  ],
})
export class PayMethodPageModule {}
