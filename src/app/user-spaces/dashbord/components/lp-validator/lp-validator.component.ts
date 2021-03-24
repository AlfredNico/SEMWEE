import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';
import { CommonService } from '@app/shared/services/common.service';
import { map } from 'rxjs/operators';
import { CheckUserInfoService } from '../../services/check-user-info.service';
import { LpValidatorService } from '../../services/lp-validator.service';
import { CheckRelevancyComponent } from './check-relevancy.component';
import { InferListComponent } from './infer-list.component';

@Component({
  selector: 'app-lp-validator',
  templateUrl: './lp-validator.component.html',
  styleUrls: ['./lp-validator.component.scss']
})
export class LpValidatorComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  // @ViewChild('stepper', { static: true }) private myStepper: MatStepper;

  //Access content on cheild
  @ViewChild(InferListComponent, { static: false }) importFile!: InferListComponent;

  //Access content on cheild
  @ViewChild(CheckRelevancyComponent, { static: false }) checkRevelancey!: CheckRelevancyComponent;
  childRevelancy = { displayColumns: [], hideColumns: [], data: [] };

  @ViewChild("matTabGroup", { static: true }) tab: any;

  public selectedIndex = 0;
  selectedStepperIndex = 0;
  isStepper = false;

  isImportItem: boolean = false;
  isUserProject: boolean = false;
  isCheckRevelancy: boolean = false;

  public idProjet: string;

  public dataSources!: { displayColumns: string[], hideColumns: string[], data: any[] };

  constructor(private auth: AuthService, private lpValidatorService: LpValidatorService, private route: ActivatedRoute, private infoProduitService: CheckUserInfoService, private common: CommonService) { }

  public dataInferList = [];

  ngOnInit(): void {
    this.common.showSpinner('root');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.idProjet = params.get('idProduit');

      if (this.idProjet) {
        const result = await this.infoProduitService.getInferList(this.idProjet);
        if (result) {
          this.selectedStepperIndex = 1;

          this.dataSources = result;
          this.common.hideSpinner('root');
          this.common.isLoading$.next(false);
        }else{
          this.common.hideSpinner('root');
          this.common.isLoading$.next(false);
        }
      }
    })
  }

  selectionChange(stepper: any) {
    this.tab.selectedIndex = 0;
  }

  // Upload file ok
  public UploadFileReady(event: any) {
    // this.isUserProject = true;
    this.dataSources = event;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  public inferListReady(event: any) {
    this.tab.selectedIndex = 0;
    // this.isCheckRevelancy = true;
    console.log('event', event)

    this.dataInferList = event;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  @HostListener('window:scroll') checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  nextTab() {
    
    if (this.checkRevelancey.dataView !== undefined) {
      Object.assign(this.childRevelancy, this.checkRevelancey.dataView);
      
      this.tab.selectedIndex = 1;
    }
  }

  previewTab(){
    this.tab.selectedIndex = 0;
  }


}
