import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

import { NoticePagePage } from './notice-page.page';

describe('NoticePagePage', () => {
  let component: NoticePagePage;
  let fixture: ComponentFixture<NoticePagePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        NoticePagePage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NoticePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
