import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLessonsPage } from './all-lessons.page';

describe('AllLessonsPage', () => {
  let component: AllLessonsPage;
  let fixture: ComponentFixture<AllLessonsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLessonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
