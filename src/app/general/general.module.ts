import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralPage } from './general.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralPage,
  },
  {
    path: 'animal-dictionary',
    loadChildren: () =>
      import('../dictionary/dictionary.module').then(
        (m) => m.DictionaryPageModule
      ),
  },
  {
    path: 'yoruba-proverbs',
    loadChildren: () =>
      import('../yoruba-proverbs/yoruba-proverbs.module').then(
        (m) => m.YorubaProverbsPageModule
      ),
  },
  {
    path: 'yoruba-songs',
    loadChildren: () =>
      import('../yoruba-songs/yoruba-songs.module').then(
        (m) => m.YorubaSongsPageModule
      ),
  },
  {
    path: 'yoruba-songs-detail',
    loadChildren: () =>
      import('../yoruba-songs-detail/yoruba-songs-detail.module').then(
        (m) => m.YorubaSongsDetailPageModule
      ),
  },
  {
    path: 'yoruba-stories',
    loadChildren: () =>
      import('../yoruba-stories/yoruba-stories.module').then(
        (m) => m.YorubaStoriesPageModule
      ),
  },
  {
    path: 'yoruba-towns',
    loadChildren: () =>
      import('../yoruba-towns/yoruba-towns.module').then(
        (m) => m.YorubaTownsPageModule
      ),
  },
  {
    path: 'yoruba-mentions',
    loadChildren: () =>
      import('../yoruba-mentions/yoruba-mentions.module').then(
        (m) => m.YorubaMentionsPageModule
      ),
  },
  {
    path: 'yoruba-mentions-detail',
    loadChildren: () =>
      import('../yoruba-mentions-detail/yoruba-mentions-detail.module').then(
        (m) => m.YorubaMentionsDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralPageModule {}


