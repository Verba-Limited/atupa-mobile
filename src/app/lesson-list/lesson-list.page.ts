import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { LessonService, Lesson } from '../services/lesson.service';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.page.html',
  styleUrls: ['./lesson-list.page.scss'],
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class LessonListPage implements OnInit {
  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  loading = false;
  searchTerm = '';
  selectedCategory = '';
  selectedLevel = 0;
  
  // Filter options
  categories = [
    { id: '', name: 'All Categories' },
    { id: '1', name: 'Numbers (Onka)' },
    { id: '2', name: 'Animals (Eranko)' },
    { id: '3', name: 'Kings (Oba Ilu)' },
    { id: '4', name: 'Proverbs (Owe)' },
    { id: '5', name: 'Towns (Ilu)' },
    { id: '6', name: 'Fruits (Eso)' },
    { id: 'alphabet', name: 'Alphabet (Alufabeti)' }
  ];
  
  levels = [
    { value: 0, name: 'All Levels' },
    { value: 1, name: 'Level 1' },
    { value: 2, name: 'Level 2' },
    { value: 3, name: 'Level 3' }
  ];

  constructor(
    private router: Router, 
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    // Check for category filter from navigation
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategory = params['categoryId'];
      }
      this.loadLessons();
    });
  }

  LessonsPage() {
    this.router.navigate(['/lessons']);
  }
  
  navigateBack() {
    this.navCtrl.back();
  }

  async loadLessons() {
    try {
      this.loading = true;
      
      const params: any = {};
      if (this.selectedCategory) {
        params.categoryId = this.selectedCategory;
      }
      if (this.selectedLevel > 0) {
        params.level = this.selectedLevel;
      }
      if (this.searchTerm) {
        params.search = this.searchTerm;
      }
      
      this.lessons = await this.lessonService.loadLessons(params);
      this.filteredLessons = [...this.lessons];
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      this.loading = false;
    }
  }

  onSearchChange() {
    this.loadLessons();
  }

  onCategoryChange() {
    this.loadLessons();
  }

  onLevelChange() {
    this.loadLessons();
  }

  openLesson(lesson: Lesson) {
    this.router.navigate(['/lessons', lesson.id]);
  }

  getLessonDuration(lesson: Lesson): string {
    return this.lessonService.formatDuration(lesson.duration);
  }

  getCategoryName(categoryId: string): string {
    return this.lessonService.getCategoryDisplayName(categoryId);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedLevel = 0;
    this.loadLessons();
  }

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

  getCategoryColor(categoryId: string): string {
    const colorMap: { [key: string]: string } = {
      '1': 'primary',
      '2': 'success',
      '3': 'warning',
      '4': 'tertiary',
      '5': 'secondary',
      '6': 'success',
      'alphabet': 'primary'
    };
    return colorMap[categoryId] || 'medium';
  }

  openFallbackLesson(lessonId: string) {
    // Navigate to a fallback lesson or show a message
    console.log('Opening fallback lesson:', lessonId);
    // You can implement fallback lesson logic here
  }
}
