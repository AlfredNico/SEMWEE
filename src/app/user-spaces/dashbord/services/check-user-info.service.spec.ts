import { TestBed } from '@angular/core/testing';

import { CheckUserInfoService } from './check-user-info.service';

describe('CheckUserInfoService', () => {
  let service: CheckUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckUserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
