import { LpViwersService } from './../../../services/lp-viwers.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { Upload } from '@app/user-spaces/dashbord/interfaces/upload';

@Component({
  selector: 'app-viwer-import',
  template: `
    <div [formGroup]="form" class="p-5" fxLayout="column" fxLayoutAlign="space-around start">

      <div fxLayout="row" fxLayoutAlign="space-around center" fxLayoutGap="20px">
        <mat-label for="file" class="py-2">
          Locate one or more files on your computer to upload:
        </mat-label>
        <button mat-raised-button (click)="fileInput.click()">
          {{ file ? file.name : 'Select' }}
        </button>
        <input hidden type="file" id="file" name="file" class="py-2" formControlName="fileSource" #fileInput (change)="onFileInput(fileInput.files)" />
      </div>


      <button type="submit" mat-raised-button (click)="form.valid && onSubmit()">
        Next
        <mat-icon aria-label="close icon">double_arrow</mat-icon>
      </button>
    </div>
  `,
})
export class ViwerImportComponent implements OnInit, OnDestroy {

  public form = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  file: File | null | undefined;

  @Output() importFile = new EventEmitter<any>();

  private subscription$: Subscription | undefined

  constructor(private lpViewerService: LpViwersService) { }

  ngOnInit(): void {
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
    }
  }

  onSubmit() {
    if (this.file) {
      this.subscription$ = this.lpViewerService
        .upload(this.file).subscribe(res => {
          if (res) {
            this.importFile.emit(res);
          }
        })
    }
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe()
  }

}
