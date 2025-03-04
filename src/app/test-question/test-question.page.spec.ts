import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestQuestionPage } from './test-question.page';

describe('TestQuestionPage', () => {
  let component: TestQuestionPage;
  let fixture: ComponentFixture<TestQuestionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
