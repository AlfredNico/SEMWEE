import { TestBed } from '@angular/core/testing';

import { ResetPasswordGuard } from './reset-password.guard';

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResetPasswordGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
