import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';
import { CommonService } from '@app/shared/services/common.service';
import { LpEditorService } from '../../services/lp-editor.service';
import { LpViwersService } from '../../services/lp-viwers.service';

@Component({
  selector: 'app-lp-editor',
  templateUrl: './lp-editor.component.html',
  styleUrls: ['./lp-editor.component.scss'],
})
export class LpEditorComponent implements OnInit, AfterViewInit {
  user: User = undefined;

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  public dataAfterUploaded: any | undefined;
  public idProject: any;
  public idFilter: any = undefined;
 public id :any = undefined;

  selectedStepperIndex: number = 0;
  public inputFilters: any[] = [];
  public filtersData: {
    items: any;
    facetQueries: any;
    searchQueries: any;
  } = undefined;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private common: CommonService,
    private lpVilpEdService: LpdLpdService
  ) {
    this.user = this.auth.currentUserSubject.value;

    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params['idProject']) {
          this.idProject = params['idProject'];
          this.idFilter = params['idFilter'];
           this.id = params['id'];
        }
      }
    });
  }

  ngDoCheck(): void {
    this.common.hideSpinner('table');
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    if (this.idProject !== undefined) {
      this.lpVilpEdService.isLoading$.next(true);
      this.lpVilpEdService
        .getSavedProjects(this.idProject,this.idFilter,this.id)
        .subscribe((res: any) => {
          if (res !== undefined) {
            this.stepper.steps.forEach((step, index) => {
              if (index < 1) {
                step.completed = true;
                step.editable = true;
              } else {
                step.completed = false;
                step.editable = true;
              }
            });

            this.lpVilpEdService.isLoading$.next(false);

            this.selectedStepperIndex = 1;
            this.dataAfterUploaded = res;
          } else this.router.navigateByUrl('user-space/lp-editor');
        });
    }
  }

  public nextReadFile(value: { idProject: any; data: any }) {
    this.dataAfterUploaded = value.data;

    if (value[0] !== undefined) {
      this.router.navigate(['user-space/lp-editor'], {
        queryParams: { idProject: value[0][0]['_id'] },
      });
    } else {
      this.router.navigate(['user-space/lp-editor'], {
        queryParams: { idProject: value.idProject },
      });
    }
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }
}
