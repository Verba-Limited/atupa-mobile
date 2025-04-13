import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompletedLevelPage } from './completed-level.page';

describe('CompletedLevelPage', () => {
  let component: CompletedLevelPage;
  let fixture: ComponentFixture<CompletedLevelPage>;

  beforeEach(waitForAsync(() => {
    const mockActivatedRoute = {
      paramMap: of({ get: (param: string) => '1' }),
      snapshot: {
        paramMap: {
          get: (param: string) => {
            if (param === 'levelObject') {
              return JSON.stringify({
                title: 'Test Level',
                levelCompleted: 1,
                totalQuestions: 10,
                totalAnswered: 10,
                totalLevelPoints: 100,
                userCumulativePoint: 80,
                percentage: 80
              });
            }
            return '1';
          }
        }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        CompletedLevelPage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
