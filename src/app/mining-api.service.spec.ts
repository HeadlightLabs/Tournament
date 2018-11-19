import { TestBed, inject } from '@angular/core/testing';

import { MiningApiService } from './mining-api.service';

describe('MiningApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiningApiService]
    });
  });

  it('should be created', inject([MiningApiService], (service: MiningApiService) => {
    expect(service).toBeTruthy();
  }));
});
