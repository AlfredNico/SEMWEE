import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { CustomValidationService } from '@app/shared/services/custom-validation.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as COUNTRY from 'src/app/shared/fake-data/countries.json';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      .mat-form-field-appearance-outline .mat-form-field-infix {
        padding: 0.5em 0 0.7em 0 !important;
      }
      .mat-form-field-infix {
        // padding: 0.5em 0;
        border-top: 0.55em solid transparent !important;
      }
      .upload-button {
        max-height: 2.5em !important;
        margin-left: 2em !important;
        min-width: auto !important;
      }
      .letter {
        width: 70px;
        height: 70px;
        margin: auto 5px;
        font-size: 5vh;
        justify-content: center;
        padding: 26px 22px;
        font-weight: bold;
        border-radius: 50%;
      }
    `,
  ],
})
export class EditComponent implements OnInit {
  public image_url: any;
  setLetters: string;
  image_project!: File;
  private imageLandscape: File;
  private imageSquared: File;

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
    @Inject(MAT_DIALOG_DATA) public data: Projects,
    public dialogRef: MatDialogRef<EditComponent>,
    private projetctService: ProjectsService,
    private notifs: NotificationService,
    private custumValidator: CustomValidationService,
    private common: CommonService
  ) {
    // this.project = this.data;
    this.image_url = environment.baseUrlImg + this.data.image_project;

    this.form.patchValue({
      ...this.data,
      letter_thumbnails_project: {
        letter: this.data.letter_thumbnails_project[0].letter,
        background: this.data.letter_thumbnails_project[0].background,
        color: this.data.letter_thumbnails_project[0].color,
      },
    });
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

  onClick(): void {
    this.dialogRef.close(this.form.value);
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

    if (
      this.imageLandscape instanceof File ||
      this.imageSquared instanceof File
    ) {
      if (this.form.valid) {
        this.common.showSpinner('root');
        try {
          const img1 = this.imageLandscape
            ? await this.projetctService.uploadImages(this.imageLandscape)
            : undefined;
          const img2 = this.imageSquared
            ? await this.projetctService.uploadImages(this.imageSquared)
            : undefined;

          const values = {
            _id: this.data._id,
            ...this.form.value,
            image_project_Landscape: img1 ? img1.img : '',
            image_project_Squared: img2 ? img2.img : '',
          };

          this.projetctService.editProjects(values).subscribe(
            (result) => {
              this.notifs.sucess(result.message);
              this.dialogRef.close(true);
              this.common.hideSpinner();
            },
            (error) => {
              this.common.hideSpinner();
            }
          );
        } catch (error) {
          if (error instanceof HttpErrorResponse) {
            console.log(error.message);
            this.notifs.warn(error.message);
          }
          this.common.hideSpinner();
          throw error;
        }
      }
    } else {
      const value = {
        _id: this.data._id,
        ...this.form.value,
        image_project: this.data.image_project,
      };

      const valus = {
        ...this.form.value,
        image_project_Landscape: this.data.image_project_Landscape,
        image_project_Squared: this.data.image_project_Squared,
      };
      this.projetctService.editProjects(value).subscribe((result) => {
        this.notifs.sucess(result.message);
        this.dialogRef.close(true);
      });
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

      // this.form.patchValue({
      //   image_project: file,
      // });
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
            this.notifs.warn(
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
            this.notifs.warn(
              `this is not squared image:  ${width} * ${height}`
            );
            this.form.get('image_project_Squared').setValue('');
            this.imageSquared = undefined;
          }
        };
      };
    }
  }
}
