import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

import { TrailComponent } from './trail.component';

describe('TrailComponent', () => {
  let component: TrailComponent;
  let fixture: ComponentFixture<TrailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        TrailComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
