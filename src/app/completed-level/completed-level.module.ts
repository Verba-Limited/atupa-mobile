import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedLevelPageRoutingModule } from './completed-level-routing.module';

import { CompletedLevelPage } from './completed-level.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedLevelPage,
    CompletedLevelPageRoutingModule,
  ],
})
export class CompletedLevelPageModule {}
