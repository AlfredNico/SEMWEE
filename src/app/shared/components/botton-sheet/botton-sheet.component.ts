import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HttpCancelService } from '@app/shared/services/http-cancel.service';

@Component({
  selector: 'app-botton-sheet',
  templateUrl: './botton-sheet.component.html',
  styleUrls: ['./botton-sheet.component.scss'],
})
export class BottonSheetComponent implements OnInit {
  constructor(
    public _bottomSheetRef: MatBottomSheetRef<BottonSheetComponent>,
    private readonly common: CommonService,
    private readonly nofits: NotificationService,
    private httpCancelService: HttpCancelService
  ) { }

  ngOnInit(): void { }

  public interropt() {
    //  this.router.events.subscribe(event => {
    //     // An event triggered at the end of the activation part of the Resolve phase of routing.
    //     if (event instanceof ActivationEnd) {
    //       // Cancel pending calls
    //       this.httpCancelService.cancelPendingRequests();
    //     }
    //   });

    this.common.isLoading$.subscribe(res => {
      if (res === true) {
        this.httpCancelService.cancelPendingRequests();
      }
    })
    this._bottomSheetRef.dismiss();
    this.common.hideSpinner();
    this.common.isLoading$.next(false);
  }
}
