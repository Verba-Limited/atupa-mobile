import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AidPage } from './aid.page';

describe('AidPage', () => {
  let component: AidPage;
  let fixture: ComponentFixture<AidPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
