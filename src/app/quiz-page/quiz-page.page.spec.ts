import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, AlertController, ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BackgroundAudioService } from '../services/background-audio.service';
import { Platform } from '@ionic/angular';

import { QuizPagePage } from './quiz-page.page';

// Mock quiz questions
const mockNumberQuestions = [
  {
    id: 'n1',
    categoryId: 'numbers',
    levelNumber: 1,
    questionNumber: 1,
    question: 'Test question 1?',
    options: { a: 'Option A', b: 'Option B', c: 'Option C', d: 'Option D' },
    answer: 'a',
    explanation: 'Test explanation',
    picture: null,
    points: 10
  }
];

describe('QuizPagePage', () => {
  let component: QuizPagePage;
  let fixture: ComponentFixture<QuizPagePage>;
  let mockBackgroundAudioService: any;

  beforeEach(waitForAsync(() => {
    // Create mock for BackgroundAudioService
    mockBackgroundAudioService = jasmine.createSpyObj('BackgroundAudioService', ['play', 'stop']);

    const mockActivatedRoute = {
      paramMap: of({ get: (param: string) => '1' }),
      snapshot: {
        paramMap: {
          get: (param: string) => {
            if (param === 'page') return 'onka';
            if (param === 'level') return '1';
            return '1';
          }
        }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(NavController),
        MockProvider(AlertController),
        MockProvider(Router),
        MockProvider(Platform),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BackgroundAudioService, useValue: mockBackgroundAudioService },
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        QuizPagePage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizPagePage);
    component = fixture.componentInstance;

    // Add mock quiz data to prevent errors
    component.quizQuestions = [...mockNumberQuestions];
    
    // Override problematic methods
    spyOn(component, 'shuffleQuestions').and.callFake(() => {});
    spyOn(component, 'loadNextQuestion').and.callFake(() => {});
    spyOn(component, 'calculateTotalLevelPoints').and.callFake(() => {});
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
