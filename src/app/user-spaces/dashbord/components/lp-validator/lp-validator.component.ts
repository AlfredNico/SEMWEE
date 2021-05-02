import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { CommonService } from '@app/shared/services/common.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { CheckUserInfoService } from '../../services/check-user-info.service';
import { CheckRelevancyComponent } from './check-relevancy.component';
import { GoogleMachingComponent } from './google-maching/google-maching.component';
import { InferListComponent } from './infer-list.component';

@Component({
  selector: 'app-lp-validator',
  templateUrl: './lp-validator.component.html',
  styleUrls: ['material-sort-icon.scss', './lp-validator.component.scss'],
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
  setIndexStep: number = 0;
  isEditeStepper = false;
  checkIndex: number;

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
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.idProjet = params.get('idProduit');
    });
  }

  public dataInferList: DataTypes;

  ngOnInit(): void { }

  async ngAfterViewInit() {
    await this.common.showSpinner('root');
    this.triggerServices.switchproject$
      .pipe(
        tap(async (idProjet: any) => {
          if (idProjet) {
            const res = (
              await this.infoProduitService.checkProject(idProjet)
            ).subscribe(async (res) => {
              if (res) {
                await this.checkProject(res);
              }
            });
          } else {
            const res = (
              await this.infoProduitService.checkProject(idProjet)
            ).subscribe(async (res) => {
              if (res) {
                await this.checkProject(res);
              }
            });
          }
        })
      )
      .subscribe();
  }

  selectionChange(ev: any) { }

  // Upload file ok
  public nextInfterList(event: any) {
    this.setIndexStep = this.stepper.selectedIndex;
    // this.isUserProject = true;
    this.dataSources = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;

    this.stepper.next();
  }

  public nextCheckRevelancy(event: any) {
    this.setIndexStep = this.stepper.selectedIndex;
    this.dataInferList = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }

  public nextMatching(event: any) {
    this.setIndexStep = this.stepper.selectedIndex;
    this.childRevelancy = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }

  private inferList(res: any[]) {
    const head = Object.keys(res[0]);
    if (head.indexOf('select') !== -1) {
      head.splice(head.indexOf('select'), 1);
    }
    head.unshift('number', 'select');
    return {
      displayColumns: head,
      data: res,
      hideColumns: [],
    };
  }

  private checkRevelancy(res: any[]) {
    const headers = [
      'number',
      'select',
      'List_Page_Label',
      'Number_of_Item',
      'List_Page_Main_Query',
      'Item_Type',
      '_1st_Property',
      '_2nd_Property',
      '_3rd_Property',
      '_4th_Property',
      '_5th_Property',
      'Property_Schema',
      '_id',
      'idProduct',
    ];
    return {
      displayColumns: headers,
      data: res,
      hideColumns: [],
    };
  }

  private async checkProject(data: any[]): Promise<void> {
    if ((data[0].length && data[1].length) > 0) {
      this.selectedStepperIndex = 2;
      this.stepper.steps.forEach((step) => {
        step.completed = true;
        step.editable = true;
      });

      this.dataSources = this.inferList(data[0]);
      this.dataInferList = this.checkRevelancy(data[1]);
      this.isNextStepp = this.stepper?.steps.toArray()[0].completed;
      // this.common.hideSpinner('root');
      this.common.isLoading$.next(false);

    } else if (data[0].length > 0 && data[1].length == 0) {
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

      this.dataSources = this.inferList(data[0]);
      this.isNextStepp = this.stepper?.steps.toArray()[0].completed;
      // this.common.hideSpinner('root');
      this.common.isLoading$.next(false);
    } else {
      this.selectedStepperIndex = 0;
      this.stepper.steps.forEach((step) => {
        step.completed = false;
        step.editable = true;
      });
      this.isNextStepp = false;
      // this.common.hideSpinner('root');
      this.common.isLoading$.next(false);
    }
  }

  public isStepper(index: number): void {
    if (typeof index === 'number') {
      this.isEditeStepper = true;
      this.checkIndex = index;
      // return this.stepper?.steps.toArray()[index].completed;
    } else {
      this.isEditeStepper = false;
      this.checkIndex = 9;
    }
  }
}
