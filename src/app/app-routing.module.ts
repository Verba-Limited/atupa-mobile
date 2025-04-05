import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'verification',
    loadChildren: () =>
      import('./verification/verification.module').then(
        (m) => m.VerificationPageModule
      ),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'levels',
    loadChildren: () =>
      import('./levels/levels.module').then((m) => m.LevelsPageModule),
  },
  {
    path: 'quiz-page',
    loadChildren: () =>
      import('./quiz-page/quiz-page.module').then((m) => m.QuizPagePageModule),
  },
  {
    path: 'eranko-quiz',
    loadChildren: () =>
      import('./eranko-quiz/eranko-quiz.module').then(
        (m) => m.ErankoQuizPageModule
      ),
  },
  {
    path: 'owe-page',
    loadChildren: () =>
      import('./owe-page/owe-page.module').then((m) => m.OwePagePageModule),
  },
  {
    path: 'completed-level',
    loadChildren: () =>
      import('./completed-level/completed-level.module').then(
        (m) => m.CompletedLevelPageModule
      ),
  },
  {
    path: 'all-level',
    loadChildren: () =>
      import('./all-level/all-level.module').then((m) => m.AllLevelPageModule),
  },
  {
    path: 'payment-successful',
    loadChildren: () => import('./payment-successful/payment-successful.module').then( m => m.PaymentSuccessfulPageModule)
  },
  {
    path: 'payment-failed',
    loadChildren: () => import('./payment-failed/payment-failed.module').then( m => m.PaymentFailedPageModule)
  },
  {
    path: 'leaderboard',
    loadChildren: () => import('./leaderboard/leaderboard.module').then( m => m.LeaderboardPageModule)
  },
  {
    path: 'achievement',
    loadChildren: () => import('./achievement/achievement.module').then( m => m.AchievementPageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.module').then( m => m.StorePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'lessons',
    loadChildren: () => import('./lessons/lessons.module').then( m => m.LessonsPageModule)
  },
  {
    path: 'basics',
    loadChildren: () => import('./basics/basics.module').then( m => m.BasicsPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'popular-lesson',
    loadChildren: () => import('./popular-lesson/popular-lesson.module').then( m => m.PopularLessonPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'test-question',
    loadChildren: () => import('./test-question/test-question.module').then( m => m.TestQuestionPageModule)
  },
  {
    path: 'bookmark',
    loadChildren: () => import('./bookmark/bookmark.module').then( m => m.BookmarkPageModule)
  },
  {
    path: 'all-lessons',
    loadChildren: () => import('./all-lessons/all-lessons.module').then( m => m.AllLessonsPageModule)
  },
  {
    path: 'lesson-list',
    loadChildren: () => import('./lesson-list/lesson-list.module').then( m => m.LessonListPageModule)
  },
  {
    path: 'pay-method',
    loadChildren: () => import('./pay-method/pay-method.module').then( m => m.PayMethodPageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then( m => m.SubscriptionPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'invite',
    loadChildren: () => import('./invite/invite.module').then( m => m.InvitePageModule)
  },  {
    path: 'aid',
    loadChildren: () => import('./aid/aid.module').then( m => m.AidPageModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./policy/policy.module').then( m => m.PolicyPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
