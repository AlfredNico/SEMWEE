import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-information-sheet-buttom',
  templateUrl: './information-sheet-buttom.component.html',
  styleUrls: ['./information-sheet-buttom.component.scss'],
})
export class InformationSheetButtomComponent implements OnInit {
  constructor(
    public _bottomSheetRef: MatBottomSheetRef<InformationSheetButtomComponent>,
    private readonly coockie: CookieService
  ) {}

  ngOnInit(): void {}

  noSee() {
    console.log('hole')
    this._bottomSheetRef.dismiss();
    this.coockie.set(
      'info',
      'hide',
      30,
      '/',
      undefined,
      false,
      'Strict'
    );
  }
}
