import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';
import { CommonService } from '@app/shared/services/common.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { map } from 'rxjs/operators';
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
  isEditable = "false"

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  // @ViewChild('stepper', { static: true }) private myStepper: MatStepper;

  //Access content on cheild
  @ViewChild(InferListComponent, { static: false }) importFile!: InferListComponent;

  //Access content on cheild
  @ViewChild(CheckRelevancyComponent, { static: false }) checkRevelancey!: CheckRelevancyComponent;
  @ViewChild(GoogleMachingComponent, { static: false }) googleMatching!: GoogleMachingComponent;
  childRevelancy = { displayColumns: [], hideColumns: [], data: [] };

  @ViewChild("matTabGroup", { static: true }) tab: any;

  selectedStepperIndex = 0;

  isImportItem: boolean = false;
  isUserProject: boolean = false;
  isCheckRevelancy: boolean = false;

  public idProjet: string;

  public dataSources!: { displayColumns: string[], hideColumns: string[], data: any[] };

  constructor(private auth: AuthService, private route: ActivatedRoute, private infoProduitService: CheckUserInfoService, private common: CommonService) { }

  public dataInferList: DataTypes;

  ngOnInit(): void {
    this.common.showSpinner('root');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.idProjet = params.get('idProduit');
    })
  }

  async ngAfterViewInit(): Promise<void> {
    this.common.showSpinner('root');
    if (this.idProjet) {
      const res = await this.infoProduitService.checkProject(this.idProjet);
      console.log(res);

      if (res && res[0].length > 0 && res[1].length > 0) {
        this.selectedStepperIndex = 2;
        this.isImportItem = true;
        this.isUserProject = true;

        this.dataSources = this.inferList(res[0]);
        this.dataInferList = this.mathiing(res[1]);
        this.common.hideSpinner('root');
        this.common.isLoading$.next(false);

      } else if (res && res[0].length > 0 && res[1].length == 0) {
        this.selectedStepperIndex = 1;
        this.isImportItem = true;
        this.isUserProject = true;
        this.isCheckRevelancy = true
        this.dataSources = this.inferList(res[0]);
        this.common.hideSpinner('root');
        this.common.isLoading$.next(false);
      }
      else {
        this.common.hideSpinner('root');
        this.common.isLoading$.next(false);
      }
    }
  }



  selectionChange(ev: any) {
    if (ev.selectedIndex == 3) {
      this.googleMatching.checkValid();
    }
  }

  // Upload file ok
  public UploadFileReady(event: any) {
    // this.isUserProject = true;
    this.dataSources = event;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  public inferListReady(event: any) {
    // this.isCheckRevelancy = true;
    this.dataInferList = event;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  public nextMatching(event: any) {

    this.childRevelancy = event;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  @HostListener('window:scroll') checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  inferList(res: any[]) {
    let obj1 = {
      displayColumns: [] as string[],
      data: [] as any[],
      hideColumns: [] as string[]
    };

    obj1.displayColumns = Object.keys(res[0]);
    obj1.displayColumns.unshift('select');
    res.reduce((tbObj: any, td: any, index: number) => {
      obj1.data[index - 1] = { ...td, 'select': true };
    });

    return obj1;
  }

  mathiing(rest: any[]) {
    let obj2 = {
      displayColumns: [] as string[],
      data: [] as any[],
      hideColumns: [] as string[]
    };

    obj2.displayColumns = Object.keys(rest[0]);
    rest.reduce((tbObj: any, td: any, index: number) => {
      obj2.data[index - 1] = td;
    });

    return obj2;
  }
}
