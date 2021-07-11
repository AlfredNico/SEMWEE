import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-licences-plans',
  template: `
    <form [formGroup]="secondFormGroup">
      <ng-template matStepLabel>Licences and Plans</ng-template>
      <mat-form-field appearance="outline" class="w-100 my-1 mx-1">
          <mat-label>Project name</mat-label>
          <input matInput placeholder="project name ..." formControlName="name_project">
          <mat-error *ngIf="form.get('name_project')?.touched && form.get('name_project')?.errors?.required">Project name is required</mat-error>
          <mat-error *ngIf="form.get('name_project')?.max">Maximum length name is 40 words</mat-error>
      </mat-form-field>
      <div>
        <button mat-button matStepperPrevious>Back</button>
        <button mat-button matStepperNext>Next</button>
      </div>
    </form>
  `,
  styleUrls: ['./licences-plans.component.scss']
})
export class LicencesPlansComponent implements OnInit {

  formLicencesPlans = this.fb.group({
    domain_project: ['', [Validators.required, Validators.max(4)]],
    user_id: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
