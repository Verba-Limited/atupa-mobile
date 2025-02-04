import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizPagePage } from './quiz-page.page';

describe('QuizPagePage', () => {
  let component: QuizPagePage;
  let fixture: ComponentFixture<QuizPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
