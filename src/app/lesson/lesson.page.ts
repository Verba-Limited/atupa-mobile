import { CategoryPage } from './../category/category.page';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LessonService, Lesson } from '../services/lesson.service';

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
export class LessonPage implements OnInit {
  isMenuVisible: boolean = false;
  showSubscription: boolean = false;
  subscriptionType = 'Monthly subscription';
  daysLeft = 20;
  progress = 60;
  
  // Backend lesson data
  popularLessons: Lesson[] = [];
  categoryLessons: Lesson[] = [];
  loading = false;
  
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    this.loadPopularLessons();
    this.loadCategoryLessons();
  }

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

  // Load popular lessons from backend
  async loadPopularLessons() {
    try {
      this.loading = true;
      this.popularLessons = await this.lessonService.loadPopularLessons(3);
    } catch (error) {
      console.error('Failed to load popular lessons:', error);
    } finally {
      this.loading = false;
    }
  }

  // Load category-based lessons
  async loadCategoryLessons() {
    try {
      // Load a mix of lessons from different categories for diversity
      const categories = ['4', '1', '2']; // Proverbs, Numbers, Animals
      for (const categoryId of categories) {
        const lessons = await this.lessonService.getLessonsByCategory(categoryId, { limit: 1 });
        this.categoryLessons.push(...lessons);
      }
    } catch (error) {
      console.error('Failed to load category lessons:', error);
    }
  }

  // Navigate to lesson detail
  openLesson(lesson: Lesson) {
    this.router.navigate(['/lessons', lesson.id]);
  }

  // Navigate to category lessons
  viewCategoryLessons(categoryId: string) {
    this.router.navigate(['/lesson-list'], { 
      queryParams: { categoryId } 
    });
  }

  // Get lesson duration display
  getLessonDuration(lesson: Lesson): string {
    return this.lessonService.formatDuration(lesson.duration);
  }

  // Get category display name
  getCategoryName(categoryId: string): string {
    return this.lessonService.getCategoryDisplayName(categoryId);
  }

  // Get category icon for display
  getCategoryIcon(categoryId: string): string {
    const iconMap: { [key: string]: string } = {
      '1': 'calculator-outline',
      '2': 'paw-outline',
      '3': 'crown-outline',
      '4': 'chatbubbles-outline',
      '5': 'business-outline',
      '6': 'leaf-outline',
      'alphabet': 'text-outline'
    };
    return iconMap[categoryId] || 'book-outline';
  }

  // Get category color for display
  getCategoryColor(categoryId: string): string {
    const colorMap: { [key: string]: string } = {
      '1': '#E19F65',
      '2': '#C5BE66',
      '3': '#F2E1CB',
      '4': '#E19F65',
      '5': '#D2CFB0',
      '6': '#FBF4E4',
      'alphabet': '#F2E1CB'
    };
    return colorMap[categoryId] || '#E19F65';
  }

  // TrackBy function for ngFor optimization
  trackByLessonItem(index: number, item: any): any {
    return item.name || index;
  }
}
