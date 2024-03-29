import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NotificationService } from '@app/services/notification.service';
import { CustomValidationService } from '@app/shared/services/custom-validation.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as COUNTRY from 'src/app/shared/fake-data/countries.json';

@Component({
  selector: 'app-add-or-edit',
  templateUrl: './add-or-edit.component.html',
  styleUrls: ['./add-or-edit.component.scss'],
})
export class AddOrEditComponent implements OnInit {
  public image_url: string = 'assets/images/png/project_img.png';
  image_project!: File;
  private imageLandscape: File;
  private imageSquared: File;

  @Input() private userId: any = undefined;
  readonly countries: any[] = (COUNTRY as any).default;
  readonly languages: { name: string; code: string }[] = [
    {
      name: 'English',
      code: 'en',
    },
    {
      name: 'Français',
      code: 'fr',
    },
  ];
  readonly protocols: string[] = ['SSL', 'TLS'];
  filteredCounrty: Observable<any[]>;
  created_at: Date = new Date();

  @Input() isAddItem: boolean = true;
  @Input() public dataSources: Projects = undefined;
  @Output() public formProject = new EventEmitter<{
    form: FormGroup;
    imageLandscape: File;
    imageSquared: File;
  }>(undefined);

  public form: any;

  ProjectLetter: any;
  ProjectBackground: any;
  ProjectColor: any;

  constructor(
    private fb: FormBuilder,
    private projetctService: ProjectsService,
    private notis: NotificationService,
    private custumValidator: CustomValidationService
  ) { }

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

  get image_project_Landscape() {
    return this.form.get('image_project_Landscape');
  }

  get image_project_Squared() {
    return this.form.get('image_project_Squared');
  }

  ngOnInit(): void {
    if (this.dataSources) {
      this.image_url = environment.baseUrlImg + this.dataSources.image_project;
      this.created_at = this.dataSources.created_project;

      this.ProjectColor = this.dataSources.letter_thumbnails_project[0][
        'color'
      ];
      this.ProjectLetter = this.dataSources.letter_thumbnails_project[0][
        'letter'
      ];
      this.ProjectBackground = this.dataSources.letter_thumbnails_project[0][
        'background'
      ];
    }

    this.form = this.fb.group({
      name_project: [
        '',
        [Validators.required, this.custumValidator.maxLength],
        [
          this.projetctService.checkProjectName(
            this.isAddItem,
            this.dataSources
          ),
        ],
        { updateOn: 'blur' },
      ],
      image_project_Landscape: [''],
      image_project_Squared: [''],
      domain_project: [
        '',
        [Validators.required, this.custumValidator.domainValidation],
      ],
      country_project: ['', [Validators.required]],
      language_project: ['', [Validators.required]],
      path_project: ['', [Validators.required]],
      protocol_project: [false],
      user_id: ['', Validators.required],
      letter_thumbnails_project: this.fb.group({
        letter: [
          this.ProjectLetter ? this.ProjectLetter : '',
          [Validators.maxLength(1),
          this.custumValidator.thunderValidator],
        ],
        color: this.ProjectColor ? this.ProjectColor : ['#66ACFF'],
        background: this.ProjectBackground
          ? this.ProjectBackground
          : ['#F3F6F9'],
      }),
    });

    if (this.dataSources) {
      this.form.patchValue({
        ...this.dataSources,
        letter_thumbnails_project: {
          letter: this.dataSources.letter_thumbnails_project[0]['letter'],
          background: this.dataSources.letter_thumbnails_project[0][
            'background'
          ],
          color: this.dataSources.letter_thumbnails_project[0]['color'],
        },
      });
    }

    this.form.patchValue({
      user_id: this.userId,
    });

    this.filteredCounrty = this.form.get('country_project').valueChanges.pipe(
      startWith(''),
      map((value: any) => {
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
            path_project: `/`,
          });
        })
      )
      .subscribe();
  }

  async onClickButton() {
    if (this.imageLandscape == undefined && this.imageSquared == undefined) {
      // this.form.get('letter_thumbnails_project')['controls']
      this.letter.setValidators([Validators.required]);
      this.form.get('image_project_Landscape').clearValidators();
      this.form.get('image_project_Squared').clearValidators();
    } else if (
      this.imageLandscape !== undefined ||
      this.imageSquared !== undefined
    ) {
      this.letter.clearValidators();
      this.form.get('image_project_Landscape').clearValidators();
      this.form.get('image_project_Squared').clearValidators();
    }
    this.form.updateValueAndValidity();
    this.letter.updateValueAndValidity();

    if (this.form.valid) {
      this.formProject.emit({
        form: this.form,
        imageLandscape: this.imageLandscape,
        imageSquared: this.imageSquared,
      });
    } else {
      this.notis.warn('invalid field !');
      // this.notis.info(`You should upload landscape or squard image or you should add thumbnails letter for your project !`);
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
            //updates forms
            this.letter.clearValidators();
            this.letter.updateValueAndValidity();
            this.form.updateValueAndValidity();
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
            //updates forms
            this.letter.clearValidators();
            this.letter.updateValueAndValidity();
            this.form.updateValueAndValidity();
          } else {
            this.notis.warn(`this is not squared image:  ${width} * ${height}`);
            this.form.get('image_project_Squared').setValue('');
            this.imageSquared = undefined;
          }
        };
      };
    }
  }

  public removeImage() {
    this.imageSquared = undefined;
    this.imageLandscape = undefined;
    this.form.controls.image_project_Landscape.setValue('');
    this.form.controls.image_project_Squared.setValue('');
  }
}
