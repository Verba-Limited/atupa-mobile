import { TestBed } from '@angular/core/testing';

import { BackgroundAudioService } from './background-audio.service';

describe('BackgroundAudioService', () => {
  let service: BackgroundAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
