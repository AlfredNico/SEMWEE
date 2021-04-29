import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReCapchaService {
  public options = {
    siteKey: '6Le4mmwaAAAAALRD4bzCHB3Af38x1X4tKooHWbYw',
    size: 'normal',
    language: 'en',
  };

  constructor() {}
}
