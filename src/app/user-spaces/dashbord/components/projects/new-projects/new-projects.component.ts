import { element } from 'protractor';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { CustomValidationService } from '@app/shared/services/custom-validation.service';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as COUNTRY from 'src/app/shared/fake-data/countries.json';

@Component({
  selector: 'app-new-projects',
  templateUrl: './new-projects.component.html',
  styleUrls: ['./new-projects.component.scss'],
  providers: [ProjectsService],
})
export class NewProjectsComponent implements OnInit {

  public user: User;
  private form: FormGroup;

  private imageLandscape: File;
  private imageSquared: File;

  constructor(
    private auth: AuthService,
    private router: Router,
    private projetctService: ProjectsService,
    private notis: NotificationService,
    private common: CommonService,
    private custumValidator: CustomValidationService
  ) {
    this.auth.currentUserSubject.subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {}

  async onSubmit(formGroup: FormGroup) {
      this.form = formGroup;
      if (this.form.valid) {

        this.common.showSpinner('root');
        try {
          const img1 = this.imageLandscape
            ? await this.projetctService.uploadImages(this.imageLandscape)
            : undefined;
          const img2 = this.imageSquared
            ? await this.projetctService.uploadImages(this.imageSquared)
            : undefined;

          const valus = {
            ...this.form.value,
            image_project_Landscape: img1 ? img1.img : '',
            image_project_Squared: img2 ? img2.img : '',
          };

          const result = await this.projetctService.addProjects(valus);
          if (result && result.message) {
            this.notis.sucess(result.message);
            this.common.hideSpinner();
            this.router.navigateByUrl('/user-space/all-project');
          } else {
            console.log('not valid');
            this.notis.warn('input required');
            this.common.hideSpinner();
          }
        } catch (error) {
          if (error instanceof HttpErrorResponse) {
            console.log(error.message);
            this.notis.info(error.message);
          }
          this.common.hideSpinner();
          throw error;
        }
      }
  }
}
