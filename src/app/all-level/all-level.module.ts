import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllLevelPageRoutingModule } from './all-level-routing.module';

import { AllLevelPage } from './all-level.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AllLevelPage,
    IonicModule,
    AllLevelPageRoutingModule,
  ],
})
export class AllLevelPageModule {}
