import { LpEditorComponent } from './lp-editor.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/modules/shared.module';



@NgModule({
  declarations: [LpEditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: LpEditorComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LpEditorModule { }
