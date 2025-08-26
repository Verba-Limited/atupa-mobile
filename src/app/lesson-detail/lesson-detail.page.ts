import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { LessonService, Lesson } from '../services/lesson.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.page.html',
  styleUrls: ['./lesson-detail.page.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true
})
export class LessonDetailPage implements OnInit {
  lesson: Lesson | null = null;
  loading = false;
  error = '';
  sanitizedContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private lessonService: LessonService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    if (lessonId) {
      this.loadLesson(lessonId);
    }
  }

  async loadLesson(id: string) {
    try {
      this.loading = true;
      this.error = '';
      
      this.lesson = await this.lessonService.getLessonById(id);
      
      if (this.lesson && this.lesson.content) {
        // Sanitize HTML content for safe display
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.lesson.content);
      }
      
      if (!this.lesson) {
        this.error = 'Lesson not found';
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
      this.error = 'Failed to load lesson. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  navigateBack() {
    this.navCtrl.back();
  }

  getLessonDuration(): string {
    if (!this.lesson) return '';
    return this.lessonService.formatDuration(this.lesson.duration);
  }

  getCategoryName(): string {
    if (!this.lesson) return '';
    return this.lessonService.getCategoryDisplayName(this.lesson.categoryId);
  }

  playAudio(audioUrl: string) {
    // Play audio file
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  }

  openImage(imageUrl: string) {
    // Open image in full screen or new window
    window.open(imageUrl, '_blank');
  }

  playVideo(videoUrl: string) {
    // Open video in player or new window
    window.open(videoUrl, '_blank');
  }

  markAsCompleted() {
    // TODO: Implement lesson completion tracking
    console.log('Marking lesson as completed:', this.lesson?.id);
  }

  shareLesson() {
    if (this.lesson) {
      // Share lesson functionality
      if (navigator.share) {
        navigator.share({
          title: this.lesson.title,
          text: this.lesson.description,
          url: window.location.href
        });
      } else {
        // Fallback for browsers without native sharing
        navigator.clipboard.writeText(window.location.href);
        console.log('Lesson URL copied to clipboard');
      }
    }
  }

  goToQuiz() {
    if (this.lesson) {
      // Navigate to quiz for this lesson's category
      this.router.navigate(['/quiz-page'], {
        queryParams: { 
          categoryId: this.lesson.categoryId,
          level: this.lesson.level 
        }
      });
    }
  }
}
