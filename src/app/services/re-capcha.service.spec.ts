import { TestBed } from '@angular/core/testing';

import { ReCapchaService } from './re-capcha.service';

describe('ReCapchaService', () => {
  let service: ReCapchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReCapchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
