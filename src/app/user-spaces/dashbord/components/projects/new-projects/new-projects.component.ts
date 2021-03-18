import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
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
    nameProject: ['', [Validators.required, Validators.max(4)]],
    // image_project: new FormControl(null, [Validators.required]),
    number_of_item: ['', Validators.required],
    numberPLI: ['', Validators.required],
    numberLPVa: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private projetctService: ProjectsService) {
    this.auth.currentUserSubject.subscribe(
      user => this.user = user
    );
  }

  ngOnInit(): void {
    // this.form.patchValue({
    //   user_id: this.user._id,
    // });
    // this.form[name].patchValue(value[name], { onlySelf: true, emitEvent });
  }

  get mixItem() {
    return this.form.controls.number_of_item.setValidators([Validators.min(0)]);
  }

  get maxItem() {
    return this.form.controls.number_of_item.setValidators([Validators.min(100)]);
  }

  onSubmit() {
    if (this.form.valid) {
      this.projetctService.uploadFiles(this.image_project).subscribe(
        async (file: any) => {
          if (file && file.url) {
            try {
              const result = await this.projetctService.addProjects(
                { ...this.form.value, 'user_id': this.user._id, 'image_project': file.url }
              );
              if (result && result.message) {
                console.log(result);
                // this.router.navigateByUrl('/user-space/all-project');
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
      )
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

      // this.form.patchValue({
      //   image_project: file,
      // });
      this.image_project = file;

    }
  }

}
