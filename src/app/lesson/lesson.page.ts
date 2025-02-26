import { LessonsPage } from './../lessons/lessons.page';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private router: Router) {}

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
      image: '../../assets/icon/alufabeti.svg',
      name: 'Alufabeti',
      hour: 6,
      bgColor: '#F2E1CB',
    },
  ];

  catgoryItem: categoryTypes[] = [
    {
      image: '../../assets/icon/Rectangle 24.svg',
      name: 'Alufabeti',
      hour: 6,
      bgColor: '#F2E1CB',
    },
    {
      image: '../../assets/icon/ilu-image.svg',
      name: 'Girama',
      hour: 8,
      bgColor: '#D2CFB0',
    },
    {
      image: '../../assets/icon/alufabeti.svg',
      name: 'Alufa',
      hour: 6,
      bgColor: '#FBF4E4',
    },
  ];

  LessonsPage() {
    this.router.navigate(['/lessons']);
  }
}
