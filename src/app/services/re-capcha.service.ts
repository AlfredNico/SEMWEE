import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReCapchaService {

  public siteKey: string = '6Le4mmwaAAAAALRD4bzCHB3Af38x1X4tKooHWbYw';
  public size: any = 'Normal';
  constructor() { }
}
