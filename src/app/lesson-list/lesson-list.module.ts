import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonListPageRoutingModule } from './lesson-list-routing.module';

import { LessonListPage } from './lesson-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonListPage,
    LessonListPageRoutingModule,
  ],
})
export class LessonListPageModule {}
