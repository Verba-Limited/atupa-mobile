import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwePagePage } from './owe-page.page';

describe('OwePagePage', () => {
  let component: OwePagePage;
  let fixture: ComponentFixture<OwePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OwePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
