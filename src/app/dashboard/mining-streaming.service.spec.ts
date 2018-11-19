import { TestBed, inject } from '@angular/core/testing';

import { MiningStreamingService } from './mining-streaming.service';

describe('MiningStreamingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiningStreamingService]
    });
  });

  it('should be created', inject([MiningStreamingService], (service: MiningStreamingService) => {
    expect(service).toBeTruthy();
  }));
});
