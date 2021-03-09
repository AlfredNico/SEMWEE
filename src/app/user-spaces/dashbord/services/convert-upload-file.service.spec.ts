import { TestBed } from '@angular/core/testing';

import { ConvertUploadFileService } from './convert-upload-file.service';

describe('ConvertUploadFileService', () => {
  let service: ConvertUploadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertUploadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
