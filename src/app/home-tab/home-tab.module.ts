import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTabPageRoutingModule } from './home-tab-routing.module';

import { HomeTabPage } from './home-tab.page';

@NgModule({
  imports: [
    CommonModule,
    HomeTabPage,
    FormsModule,
    IonicModule,
    HomeTabPageRoutingModule,
  ],
})
export class HomeTabPageModule {}
