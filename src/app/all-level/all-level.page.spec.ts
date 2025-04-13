import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

import { AllLevelPage } from './all-level.page';

describe('AllLevelPage', () => {
  let component: AllLevelPage;
  let fixture: ComponentFixture<AllLevelPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        AllLevelPage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
