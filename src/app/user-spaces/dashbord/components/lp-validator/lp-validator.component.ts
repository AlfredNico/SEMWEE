import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';
import { CommonService } from '@app/shared/services/common.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { CheckUserInfoService } from '../../services/check-user-info.service';
import { LpValidatorService } from '../../services/lp-validator.service';
import { CheckRelevancyComponent } from './check-relevancy.component';
import { GoogleMachingComponent } from './google-maching/google-maching.component';
import { InferListComponent } from './infer-list.component';

@Component({
  selector: 'app-lp-validator',
  templateUrl: './lp-validator.component.html',
  styleUrls: ['./lp-validator.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class LpValidatorComponent implements OnInit, AfterViewInit {
  isEditable = 'false';

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  // @ViewChild('stepper', { static: true }) private myStepper: MatStepper;

  //Access content on cheild
  @ViewChild(InferListComponent, { static: false })
  importFile!: InferListComponent;

  //Access content on cheild
  @ViewChild(CheckRelevancyComponent, { static: false })
  checkRevelancey!: CheckRelevancyComponent;
  @ViewChild(GoogleMachingComponent, { static: false })
  googleMatching!: GoogleMachingComponent;
  childRevelancy = { displayColumns: [], hideColumns: [], data: [] };

  @ViewChild('matTabGroup', { static: true }) tab: any;

  selectedStepperIndex = 0;

  public idProjet: string;

  public dataSources!: {
    displayColumns: string[];
    hideColumns: string[];
    data: any[];
  };

  isNextStepp: boolean = false;

  @HostListener('window:scroll') checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
  }

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private infoProduitService: CheckUserInfoService,
    private common: CommonService,
    private triggerServices: TriggerService
  ) {
    this.common.showSpinner('root');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.idProjet = params.get('idProduit');
    });
  }

  public dataInferList: DataTypes;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.triggerServices.switchproject$
      .pipe(
        tap(() => {
          console.log('selected');
          this.common.showSpinner('root');
        }),
        map(async (idProjet) => {
          console.log(idProjet);
          
          if (idProjet) {
            this.idProjet = idProjet;
            await this.checkProject();
          } else await this.checkProject();
          this.common.hideSpinner('root');
          this.common.isLoading$.next(false);
        })
      )
      .subscribe();
    // this.checkProject();
  }

  selectionChange(ev: any) {
    // if (ev.selectedIndex == 3) {
    //   this.googleMatching.checkValid();
    // }
  }

  // Upload file ok
  public nextInfterList(event: any) {
    // this.isUserProject = true;
    this.dataSources = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;

    this.stepper.next();
  }

  public nextCheckRevelancy(event: any) {
    // this.isCheckRevelancy = true;
    this.dataInferList = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }

  public nextMatching(event: any) {
    this.childRevelancy = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }

  inferList(res: any[]) {
    let obj1 = {
      displayColumns: [] as string[],
      data: [] as any[],
      hideColumns: [] as string[],
    };

    obj1.displayColumns = Object.keys(res[0]);
    obj1.displayColumns.unshift('select');
    res.map((tbObj: any, index: number) => {
      obj1.data[index] = { ...tbObj, select: true };
    });

    return obj1;
  }

  mathiing(rest: any[]) {
    let obj2 = {
      displayColumns: [] as string[],
      data: [] as any[],
      hideColumns: [] as string[],
    };

    obj2.displayColumns = Object.keys(rest[0]);
    rest.map((tbObj: any, index: number) => {
      obj2.data[index] = tbObj;
    });

    return obj2;
  }

  private async checkProject(): Promise<void> {
    this.common.showSpinner('root');
    if (this.idProjet) {
      const res = await this.infoProduitService.checkProject(this.idProjet);
      if (res && res[0].length > 0 && res[1].length > 0) {
        this.selectedStepperIndex = 2;
        this.stepper.steps.forEach((step) => {
          step.completed = true;
          step.editable = true;
        });

        this.dataSources = this.inferList(res[0]);
        this.dataInferList = this.mathiing(res[1]);
        this.isNextStepp = this.stepper?.steps.toArray()[0].completed;
      } else if (res && res[0].length > 0 && res[1].length == 0) {
        this.selectedStepperIndex = 1;
        this.stepper.steps.forEach((step, index) => {
          if (index < 1) {
            step.completed = true;
            step.editable = true;
          } else {
            step.completed = false;
            step.editable = true;
          }
        });

        this.dataSources = this.inferList(res[0]);
        this.isNextStepp = this.stepper?.steps.toArray()[0].completed;
      } else {
        this.selectedStepperIndex = 0;
        this.stepper.steps.forEach((step) => {
          step.completed = false;
          step.editable = true;
        });
        this.isNextStepp = false;
      }
    }
  }
}
function startWidth(arg0: {}): import("rxjs").OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}

