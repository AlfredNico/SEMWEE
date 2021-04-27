import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-botton-sheet',
  templateUrl: './botton-sheet.component.html',
  styleUrls: ['./botton-sheet.component.scss'],
})
export class BottonSheetComponent implements OnInit {
  constructor(
    public _bottomSheetRef: MatBottomSheetRef<BottonSheetComponent>,
    private readonly common: CommonService,
    private readonly nofits: NotificationService
  ) {}

  ngOnInit(): void {}

  public interropt() {
    this._bottomSheetRef.dismiss();
    this.common.hideSpinner();
    this.common.isLoading$.next(false);
  }
}
