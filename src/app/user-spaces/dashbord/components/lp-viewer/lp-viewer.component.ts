import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/shared/services/common.service';
import { LpViwersService } from '../../services/lp-viwers.service';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';
// import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';

@Component({
  selector: 'app-lp-viewer',
  templateUrl: './lp-viewer.component.html',
  styleUrls: ['./lp-viewer.component.scss'],
})
export class LpViewerComponent implements AfterViewInit {
  user: User = undefined;
  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  public dataAfterUploaded: any | undefined;
  public idProject: any;
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
    //private lpviewer: LpViwersService,
    private lpVilpEdService: LpdLpdService
  ) {
    this.user = this.auth.currentUserSubject.value;

    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params['idProject']) {
          this.idProject = params['idProject'];
        }
      }
    });
  }

  // ngDoCheck(): void {
  //   this.common.hideSpinner('table');
  // }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.idProject !== undefined) {
      this.lpVilpEdService.isLoading$.next(true); // load spinner
      this.lpVilpEdService
        .getSavedProjects(this.idProject)
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

            this.selectedStepperIndex = 1;
            this.dataAfterUploaded = res;
            this.lpVilpEdService.isLoading$.next(false);
          }
          //else this.router.navigateByUrl('user-space/lp-editor');
        });
    }
  }

  public nextReadFile(value: { idProject: any; data: any }) {
    this.dataAfterUploaded = value;
    // if (value[0] !== undefined) {
    //   this.router.navigate(['user-space/lp-viewer'], {
    //     queryParams: { idProject: value[0][0]['_id'] },
    //   });
    // } else {
    this.router.navigate(['user-space/lp-viewer'], {
      queryParams: { idProject: value.idProject },
    });
    // }
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }
}
