import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { CustomValidationService } from '@app/shared/services/custom-validation.service';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as COUNTRY from 'src/app/shared/fake-data/countries.json';


@Component({
  selector: 'app-add-or-edit',
  templateUrl: './add-or-edit.component.html',
  styleUrls: ['./add-or-edit.component.scss']
})
export class AddOrEditComponent implements OnInit {

  public image_url: string = 'assets/images/png/project_img.png';
  image_project!: File;
  private imageLandscape: File;
  private imageSquared: File;

  @Input() public user: User;
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

  @Input() isAddItem: boolean = true;
  @Output() public formProject = new EventEmitter<FormGroup>(null);

  public form = this.fb.group({
    name_project: [
      '',
      [Validators.required, this.custumValidator.maxLength],
      [this.projetctService.checkProjectName()],
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
    protocol_project: ['', [Validators.required]],
    user_id: ['', Validators.required],
    letter_thumbnails_project: this.fb.group({
      letter: [
        '',
        [Validators.maxLength(1), this.custumValidator.uppercaseValidator],
      ],
      color: ['#66ACFF'],
      background: ['#F3F6F9'],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private projetctService: ProjectsService,
    private notis: NotificationService,
    private common: CommonService,
    private custumValidator: CustomValidationService
  ) {}

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
            path_project: `/`,
          });
        })
      )
      .subscribe();
  }

  async onClickButton() {
    console.log('value', this.form.value);
    // this.f1.emit(this.form);
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
      this.formProject.emit(this.form);
    }else{
      this.notis.info(`You should upload landscape or squard image or you should add thumbnails letter for your project !`);
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

}
