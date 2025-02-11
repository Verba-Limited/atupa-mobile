import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLevelPage } from './all-level.page';

describe('AllLevelPage', () => {
  let component: AllLevelPage;
  let fixture: ComponentFixture<AllLevelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
