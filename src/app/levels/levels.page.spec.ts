import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LevelsPage } from './levels.page';

describe('LevelsPage', () => {
  let component: LevelsPage;
  let fixture: ComponentFixture<LevelsPage>;

  beforeEach(waitForAsync(() => {
    const mockActivatedRoute = {
      paramMap: of({ get: (param: string) => '1' }),
      snapshot: {
        paramMap: {
          get: (param: string) => '1'
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
        LevelsPage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LevelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
