import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticePagePageRoutingModule } from './notice-page-routing.module';

import { NoticePagePage } from './notice-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoticePagePageRoutingModule,
    NoticePagePage,
  ],
})
export class NoticePagePageModule {}
