import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';

@Component({
  selector: 'app-new-projects',
  templateUrl: './new-projects.component.html',
  styleUrls: ['./new-projects.component.scss']
})
export class NewProjectsComponent implements OnInit {

  public image_url: any = "https://material.angular.io/assets/img/examples/shiba2.jpg";
  image_project!: File;

  private user: User;
  form = this.fb.group({
    name_project: ['', [Validators.required, Validators.max(4)]],
    // image_project: new FormControl(null, [Validators.required]),
    // number_of_item: ['', Validators.required],
    // numberPLI: ['', Validators.required],
    // numberLPVa: ['', Validators.required],
    user_id: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private projetctService: ProjectsService, private notis: NotificationService, private common: CommonService) {
    this.auth.currentUserSubject.subscribe(
      user => this.user = user
    );
  }

  ngOnInit(): void {
    this.form.patchValue({
      user_id: this.user._id,
    });
    // this.form[name].patchValue(value[name], { onlySelf: true, emitEvent });
  }

  // get mixItem() {
  //   return this.form.controls.number_of_item.setValidators([Validators.min(0)]);
  // }

  // get maxItem() {
  //   return this.form.controls.number_of_item.setValidators([Validators.min(100)]);
  // }

  onSubmit() {
    console.log(this.image_project);

    if (this.form.valid && this.image_project !== undefined) {
      this.common.showSpinner('root');
      this.projetctService.uploadFiles(this.image_project).subscribe(
        async (file: any) => {
          console.log(this.user._id);

          const id = this.user._id;

          if (file && file.message) {
            try {
              const result = await this.projetctService.addProjects(
                { ...this.form.value, 'image_project': file.message }
              )
              if (result && result.message) {
                this.notis.sucess(result.message);
                this.router.navigateByUrl('/user-space/all-project');
                this.common.hideSpinner();
              }
            } catch (error) {
              this.common.hideSpinner();
              throw error;
            }
          }
        },
        (error) => {
          this.notis.warn('Error to upload file');
          this.common.hideSpinner();
        }
      )
    } else if (this.image_project === undefined) {
      this.notis.warn('File upload undefined');
    }
  }

  onImageChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0] as any;
      reader.onload = (event: any) => {
        this.image_url = event.target.result;

      }
      reader.readAsDataURL(event.target.files[0]);

      this.image_project = file;

    }
  }

}
