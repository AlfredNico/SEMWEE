import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';

@Component({
  selector: 'app-info',
  template: `
<form [formGroup]="formInfo">
<div fxLayout="column" fxLayoutAlign="center center">
    <img mat-card-image style="height: 100px;
    width: 100px;" [src]="image_url" alt="project images">
    <input type="file" accept="image/*" #file (change)="onImageChanged($event)" style="display:none;" />
    <button mat-raised-button type="button" (click)="file.click()">Change</button>
</div>

<mat-form-field appearance="outline" class="w-100 my-1 mx-1">
    <mat-label>Name/ Nom</mat-label>
    <input matInput placeholder="project name ..." formControlName="name_project">
    <mat-error *ngIf="form.get('name_project')?.touched && form.get('name_project')?.errors?.required">Project name is required</mat-error>
    <mat-error *ngIf="form.get('name_project')?.max">Maximum length name is 40 words</mat-error>
</mat-form-field>

<mat-form-field appearance="outline" class="w-100 my-1 mx-1">
    <mat-label>Name/ Nom</mat-label>
    <input matInput placeholder="project name ..." formControlName="name_project">
    <mat-error *ngIf="form.get('name_project')?.touched && form.get('name_project')?.errors?.required">Project name is required</mat-error>
    <mat-error *ngIf="form.get('name_project')?.max">Maximum length name is 40 words</mat-error>
</mat-form-field>

<mat-form-field appearance="outline" class="w-100 my-1 mx-1">
    <mat-label>Name/ Nom</mat-label>
    <input matInput placeholder="project name ..." formControlName="name_project">
    <mat-error *ngIf="form.get('name_project')?.touched && form.get('name_project')?.errors?.required">Project name is required</mat-error>
    <mat-error *ngIf="form.get('name_project')?.max">Maximum length name is 40 words</mat-error>
</mat-form-field>

<mat-form-field appearance="outline" class="w-100 my-1 mx-1">
    <mat-label>Name/ Nom</mat-label>
    <input matInput placeholder="project name ..." formControlName="name_project">
    <mat-error *ngIf="form.get('name_project')?.touched && form.get('name_project')?.errors?.required">Project name is required</mat-error>
    <mat-error *ngIf="form.get('name_project')?.max">Maximum length name is 40 words</mat-error>
</mat-form-field>
<div>
  <button mat-button matStepperNext>Next</button>
</div>
</form>
  `,
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  formInfo = this.fb.group({
    name_project: ['', [Validators.required, Validators.max(20)]],
    domain_project: [''],
    user_id: ['', Validators.required],
  });
  @Input() user: Users;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formInfo.patchValue({
      user_id: this.user._id,
    })
  }

}
