import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedLevelPage } from './completed-level.page';

describe('CompletedLevelPage', () => {
  let component: CompletedLevelPage;
  let fixture: ComponentFixture<CompletedLevelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
