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
  idProduct: any;
  selectedStepperIndex: number = 0;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private common: CommonService, private lpviewer: LpViwersService) {
    this.user = this.auth.currentUserSubject.value;

    this.route.queryParams
      .subscribe(params => {
        if (params) {
          if (params['idProduct']) {
            this.idProduct = params['idProduct'];
            this.selectedStepperIndex = 1;
          }
        }
      });

  }

  ngDoCheck(): void {
    this.common.hideSpinner();
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    if (this.idProduct !== undefined) {
      this.stepper.steps.forEach((step, index) => {
        if (index < 1) {
          step.completed = true;
          step.editable = true;
        } else {
          step.completed = false;
          step.editable = true;
        }
      });

      this.lpviewer.getSavedProjects(this.idProduct).subscribe(res => {
        if (res !== undefined) {
          this.dataAfterUploaded = res;
        }
      });
      this.router.navigate(['user-space/lp-viewer'],
        { queryParams: { idProduct: this.idProduct } });
    }
  }

  public nextReadFile(value: any) {
    console.log(value);

    this.dataAfterUploaded = value;
    this.router.navigate(['user-space/lp-viewer'], {
      queryParams: { idProduct: value[0][0]['_id'] }
    });
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }
}
