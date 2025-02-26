import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsPage } from './basics.page';

describe('BasicsPage', () => {
  let component: BasicsPage;
  let fixture: ComponentFixture<BasicsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
