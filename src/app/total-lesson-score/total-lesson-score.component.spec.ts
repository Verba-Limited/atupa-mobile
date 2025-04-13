import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

import { TotalLessonScoreComponent } from './total-lesson-score.component';

describe('TotalLessonScoreComponent', () => {
  let component: TotalLessonScoreComponent;
  let fixture: ComponentFixture<TotalLessonScoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        TotalLessonScoreComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalLessonScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
