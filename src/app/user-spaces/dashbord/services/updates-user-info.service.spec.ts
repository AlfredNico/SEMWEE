import { TestBed } from '@angular/core/testing';

import { UpdatesUserInfoService } from './updates-user-info.service';

describe('UpdatesUserInfoService', () => {
  let service: UpdatesUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatesUserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
