import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home-tab',
        loadChildren: () =>
          import('../home-tab/home-tab.module').then(
            (m) => m.HomeTabPageModule
          ),
      },
      {
        path: 'quiz',
        loadChildren: () =>
          import('../quiz/quiz.module').then((m) => m.QuizPageModule),
      },
      {
        path: 'lesson',
        loadChildren: () =>
          import('../lesson/lesson.module').then((m) => m.LessonPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },

      {
        path: '',
        redirectTo: '/tabs/home-tab',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
