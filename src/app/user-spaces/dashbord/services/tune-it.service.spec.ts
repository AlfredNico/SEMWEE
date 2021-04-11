import { TestBed } from '@angular/core/testing';

import { TuneItService } from './tune-it.service';

describe('TuneItService', () => {
  let service: TuneItService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TuneItService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
