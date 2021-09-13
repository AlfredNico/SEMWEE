import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';

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
    private lpVilpEdService: LpdLpdService
  ) {
    this.user = this.auth.currentUserSubject.value;

    this.route.queryParams.subscribe((params) => {
        console.log("Parametre : ",params)
      if (params) {
        if (params['idProject']) {
          this.idProject = params['idProject'];
          this.idFilter = params['idFilter'];
          this.id = params['id'];
        }
      }
    });
  }

  ngAfterViewInit() {
      console.log(`Id Project : ${this.idProject}, Id Filter : ${this.idFilter}`)
    if (this.idProject !== undefined) {
      this.lpVilpEdService.isLoading$.next(true); // load spinner
      this.lpVilpEdService
        .getSavedProjects(this.idProject, this.idFilter,this.id)
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
            console.log("In lpviewer simple : ",res);
            this.selectedStepperIndex = 1;
            this.dataAfterUploaded = res;
            this.lpVilpEdService.isLoading$.next(false);
          }
        });
    }
  }

  public nextReadFile(value: {
    idProject: any;
    file: File;
    projectName: string;
  }) {
    this.dataAfterUploaded = value;
    this.router.navigate(['user-space/lp-viewer'], {
      queryParams: { idProject: value.idProject },
    });
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
      this.stepper.next();
  }
}
