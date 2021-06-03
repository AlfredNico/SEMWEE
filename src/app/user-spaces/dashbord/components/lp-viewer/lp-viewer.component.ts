import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/shared/services/common.service';
import { LpViwersService } from '../../services/lp-viwers.service';

@Component({
  selector: 'app-lp-viewer',
  templateUrl: './lp-viewer.component.html',
  styleUrls: ['./lp-viewer.component.scss'],
})
export class LpViewerComponent implements OnInit, AfterViewInit {
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
    private lpviewer: LpViwersService
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

  ngDoCheck(): void {
    this.common.hideSpinner('table');
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.idProject !== undefined) {
      this.lpviewer.isLoading$.next(true);
      this.lpviewer
        .getSavedProjects(this.idProject)
        .subscribe((res: Array<any>) => {
          // console.log(res);
          // console.log(res);
          if (res !== undefined && res[0].length > 0 && res[1].length > 0) {
            if (res[3].length > 0) {
              this.filtersData = JSON.parse(res[3][0]['value']);
            }
            if (res[2].length > 0) {
              this.inputFilters = JSON.parse(res[2][0]['value']);
            }
            this.stepper.steps.forEach((step, index) => {
              if (index < 1) {
                step.completed = true;
                step.editable = true;
              } else {
                step.completed = false;
                step.editable = true;
              }
            });

            // this.lpviewer.isLoading$.next(false);

            this.selectedStepperIndex = 1;
            this.dataAfterUploaded = res;
          } else this.router.navigateByUrl('user-space/lp-viewer');
        });
      // this.router.navigate(['user-space/lp-viewer'],
      //   { queryParams: { idProject: this.idProject } });
    }
  }

  public nextReadFile(value: { idProject: any; data: any }) {
    this.dataAfterUploaded = value.data;

    if (value[0] !== undefined) {
      this.router.navigate(['user-space/lp-viewer'], {
        queryParams: { idProject: value[0][0]['_id'] },
      });
    } else {
      this.router.navigate(['user-space/lp-viewer'], {
        queryParams: { idProject: value.idProject },
      });
    }
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }
}
