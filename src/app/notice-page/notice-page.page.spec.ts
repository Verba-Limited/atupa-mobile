import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoticePagePage } from './notice-page.page';

describe('NoticePagePage', () => {
  let component: NoticePagePage;
  let fixture: ComponentFixture<NoticePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
