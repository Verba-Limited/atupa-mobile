import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErankoQuizPage } from './eranko-quiz.page';

describe('ErankoQuizPage', () => {
  let component: ErankoQuizPage;
  let fixture: ComponentFixture<ErankoQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErankoQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
