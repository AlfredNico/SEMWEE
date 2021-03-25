import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';
import { CommonService } from '@app/shared/services/common.service';
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
export class LpValidatorComponent implements OnInit {
  isEditable="false"

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
        } else {
          this.common.hideSpinner('root');
          this.common.isLoading$.next(false);
        }
      }
    })
  }

  selectionChange(stepper: any) {
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
}
