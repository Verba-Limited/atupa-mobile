import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface StoryItem {
  title: string;
}

@Component({
  selector: 'app-yoruba-stories',
  templateUrl: './yoruba-stories.page.html',
  styleUrls: ['./yoruba-stories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class YorubaStoriesPage {
  stories: StoryItem[] = [
    { title: 'Ita Ibadan' },
    { title: 'Ife Origins' },
  ];
}


