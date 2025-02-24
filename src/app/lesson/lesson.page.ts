import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

interface lessonTypes {
  image: string;
  name: string;
  hour: number;
  bgColor: string;
}
interface categoryTypes {
  image: string;
  name: string;
  hour: number;
  bgColor: string;
}

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class LessonPage {
  constructor() {}

  lessonItem: lessonTypes[] = [
    {
      image: '../../assets/icon/Rectangle 24.svg',
      name: 'Owe',
      hour: 6,
      bgColor: '#E19F65',
    },
    {
      image: '../../assets/icon/ilu-image.svg',
      name: 'Ilu',
      hour: 8,
      bgColor: '#C5BE66',
    },
    {
      image: '../../assets/icon/Rectangle 52.svg',
      name: 'Alufa',
      hour: 6,
      bgColor: '#F2E1CB',
    },
  ];

  catgoryItem: categoryTypes[] = [
    {
      image: '../../assets/icon/abc.svg',
      name: 'Owe',
      hour: 6,
      bgColor: '#E19F65',
    },
    {
      image: '../../assets/images/cat.jpeg',
      name: 'Ilu',
      hour: 8,
      bgColor: '#C5BE66',
    },
    {
      image: '../../assets/icon/Rectangle 52.svg',
      name: 'Alufa',
      hour: 6,
      bgColor: '#F2E1CB',
    },
  ];
}
