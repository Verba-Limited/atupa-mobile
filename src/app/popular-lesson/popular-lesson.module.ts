import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopularLessonPageRoutingModule } from './popular-lesson-routing.module';

import { PopularLessonPage } from './popular-lesson.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopularLessonPage,
    PopularLessonPageRoutingModule,
  ],
})
export class PopularLessonPageModule {}
