import { CategoryPage } from './../category/category.page';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

interface lessonTypes {
  image: string;
  name: string;
  hour: number;
  bgColor: string;
  link?: string;
}
interface categoryTypes {
  image: string;
  name: string;
  hour: number;
  bgColor: string;
  link?: string;
}

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class LessonPage {
  isMenuVisible: boolean = false;
  showSubscription: boolean = false;
  subscriptionType = 'Monthly subscription';
  daysLeft = 20;
  progress = 60;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

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

  categoryPage(pageName: string) {
    this.router.navigate(['/category', { page: pageName }]);
  }
  popularPage(pageName: string) {
    this.router.navigate(['/popular-lesson', { page: pageName }]);
  }

  navigateToBookmarks() {
    // Navigate to bookmarks page
    this.router.navigate(['/bookmark']);
    this.isMenuVisible = false;
  }

  manageSubscription() {
    this.isMenuVisible = false;
    this.showSubscription = true;
  }

  closeSubscripton() {
    this.showSubscription = false;
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menuContainer = document.querySelector('.menu-container');

    if (menuContainer && !menuContainer.contains(target)) {
      this.isMenuVisible = false;
    }
  }
  LessonsPage() {
    this.router.navigate(['/lessons']);
  }
  category() {
    this.router.navigate(['/category']);
  }
  allLessons() {
    this.router.navigate(['/lesson-list']);
  }
}
