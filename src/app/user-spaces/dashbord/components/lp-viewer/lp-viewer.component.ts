import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/shared/services/common.service';

@Component({
  selector: 'app-lp-viewer',
  templateUrl: './lp-viewer.component.html',
  styleUrls: ['./lp-viewer.component.scss'],
})
export class LpViewerComponent implements OnInit, AfterViewInit {

  user: User = undefined;
  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  public dataAfterUploaded: any | undefined;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private common: CommonService) {
    this.user = this.auth.currentUserSubject.value;

    this.route.queryParams
      .subscribe(params => {
        if (params) {
          if (params['idProduct']) {
            this.router.navigate(['user-space/lp-viewer'],
              { queryParams: { idProduct: params['idProduct'] } });
          }
        }
      });

  }

  ngDoCheck(): void {
    this.common.hideSpinner();
  }

  ngOnInit(): void { }

  ngAfterViewInit() { }

  public nextReadFile(value: any) {
    this.dataAfterUploaded = value;
    this.router.navigate(['user-space/lp-viewer'], {
      queryParams: { idProduct: value[0][0]['_id'] }
    });
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }
}
