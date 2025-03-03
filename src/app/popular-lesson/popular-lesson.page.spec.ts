import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopularLessonPage } from './popular-lesson.page';

describe('PopularLessonPage', () => {
  let component: PopularLessonPage;
  let fixture: ComponentFixture<PopularLessonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularLessonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
