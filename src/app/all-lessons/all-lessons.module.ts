import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllLessonsPageRoutingModule } from './all-lessons-routing.module';

import { AllLessonsPage } from './all-lessons.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllLessonsPage,
    AllLessonsPageRoutingModule,
  ],
})
export class AllLessonsPageModule {}
