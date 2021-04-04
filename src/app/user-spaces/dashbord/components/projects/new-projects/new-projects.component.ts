import { HttpErrorResponse } from '@angular/common/http';
import { Component, forwardRef, Inject, OnInit } from '@angular/core';
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
  public image_url: string = 'assets/images/png/project_img.png';
  image_project!: File;
  private imageLandscape: File;
  private imageSquared: File;

  private user: User;
  countries: any[] = (COUNTRY as any).default;
  languages: any[] = [
    {
      name: 'English',
      code: 'en',
    },
    {
      name: 'Français',
      code: 'fr',
    },
  ];
  protocols: string[] = ['SSL', 'TLS'];
  filteredCounrty: Observable<any[]>;

  formInfo: FormGroup;
  formCatg: FormGroup;
  formLicencesPlans: FormGroup;
  private readonly regex = /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/;

  form = this.fb.group({
    name_project: [
      '',
      [Validators.required, Validators.maxLength(10)],
      [this.projetctService.checkProjectName()],
      { updateOn: 'blur' },
    ],
    image_project_Landscape: [''],
    image_project_Squared: [''],
    domain_project: ['', [Validators.required, Validators.pattern(this.regex)]],
    country_project: ['', [Validators.required]],
    language_project: ['', [Validators.required]],
    path_project: ['', [Validators.required]],
    protocol_project: ['', [Validators.required]],
    user_id: ['', Validators.required],
    letter_thumbnails_project: this.fb.group({
      letter: [
        '',
        [
          Validators.pattern(/^[A-Z]/),
          Validators.maxLength(1),
          this.custumValidator.patternValidator,
        ],
      ],
      color: ['#015fec'],
      background: ['#eab150'],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private projetctService: ProjectsService,
    private notis: NotificationService,
    private common: CommonService,
    private custumValidator: CustomValidationService
  ) {
    this.auth.currentUserSubject.subscribe((user) => (this.user = user));
  }

  get name_project() {
    return this.form.get('name_project');
  }

  get letter() {
    return this.form.get('letter_thumbnails_project')['controls'].letter;
  }
  get color() {
    return this.form.get('letter_thumbnails_project').value.color;
  }

  get background() {
    return this.form.get('letter_thumbnails_project').value.background;
  }

  ngOnInit(): void {
    this.form.patchValue({
      user_id: this.user._id,
    });

    this.filteredCounrty = this.form.get('country_project').valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.countries.filter((x) =>
          x.name.toLowerCase().includes(value.toLowerCase())
        );
      })
    );

    this.form
      .get('language_project')
      .valueChanges.pipe(
        map((value) => {
          this.form.patchValue({
            path_project: `/${value}/*`,
          });
        })
      )
      .subscribe();
  }

  async onSubmit() {
    if (this.imageLandscape == undefined && this.imageSquared == undefined) {
      // this.form.get('letter_thumbnails_project')['controls']
      this.letter.setValidators([Validators.required]);
      this.form.get('image_project_Landscape').clearValidators();
      this.form.get('image_project_Squared').clearValidators();
    } else if (
      this.imageLandscape != undefined ||
      this.imageSquared != undefined
    ) {
      this.letter.clearValidators();
      this.form.get('image_project_Landscape').clearValidators();
      this.form.get('image_project_Squared').clearValidators();
    }
    this.form.updateValueAndValidity();
    this.letter.updateValueAndValidity();

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
          this.notis.warn(error.message);
        }
        this.common.hideSpinner();
        throw error;
      }
    }
  }

  onImageChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0] as any;
      reader.onload = (event: any) => {
        this.image_url = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);

      this.image_project = file;
    }
  }

  uploadLandscape(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const img = new Image();
      let image_url: any;

      const file = event.target.files[0] as any;
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = () => {
        image_url = event.target.result;
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;

          if (width > height) {
            this.form.get('image_project_Landscape').setValue(file.name);
            this.imageLandscape = file;
          } else {
            this.notis.warn(
              `this is not landscape image:  ${width} * ${height}`
            );
            this.form.get('image_project_Landscape').setValue('');
            this.imageLandscape = undefined;
          }
        };
      };
    }
  }

  uploadSquared(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const img = new Image();
      let image_url: any;

      const file = event.target.files[0] as any;
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = () => {
        image_url = event.target.result;
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;

          if (width == height) {
            this.form.get('image_project_Squared').setValue(file.name);
            this.imageSquared = file;
          } else {
            this.notis.warn(`this is not squared image:  ${width} * ${height}`);
            this.form.get('image_project_Squared').setValue('');
            this.imageSquared = undefined;
          }
        };
      };
    }
  }
}
