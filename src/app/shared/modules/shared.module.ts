import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgxCaptchaModule } from 'ngx-captcha';

import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSnackBarModule,
    NgxCaptchaModule,
    NgxSpinnerModule,
    TranslateModule,
    MatBottomSheetModule,
  ],
})
export class SharedModule {}
