import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

import { HomeTabPage } from './home-tab.page';

describe('HomeTabPage', () => {
  let component: HomeTabPage;
  let fixture: ComponentFixture<HomeTabPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        HomeTabPage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
