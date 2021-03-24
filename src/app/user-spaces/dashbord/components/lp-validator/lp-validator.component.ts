import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';
import { map } from 'rxjs/operators';
import { LpValidatorService } from '../../services/lp-validator.service';
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

  @ViewChild("matTabGroup", { static: true }) tab: any;

  public selectedIndex = 0;
  selectedStepperIndex = 0;
  isStepper = false;

  isImportItem: boolean = false;
  isUserProject: boolean = false;
  isCheckRevelancy: boolean = false;

  public dataSources!: { displayColumns: string[], hideColumns: string[], data: any[] };

  constructor(private auth: AuthService, private lpValidatorService: LpValidatorService) { }

  public dataInferList = [];

  ngOnInit(): void {
    this.auth.currentUserSubject.pipe(
      map(async (user: Users) => {
        if (user) {
          if (user.projet.length > 0) {
            this.isUserProject = true;
            this.selectedStepperIndex = 1;
            this.dataSources = await this.lpValidatorService.getIngetListProject();
          }
        }
      })
    ).subscribe();
  }

  selectionChange(stepper: any) {
    console.log('1', this.isImportItem);
    console.log('2', this.isUserProject);
    console.log('3', this.isCheckRevelancy);
    this.tab.selectedIndex = 0;
    console.log('item', stepper);
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

    this.dataInferList = event;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  @HostListener('window:scroll') checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  nextTab() {
    this.tab.selectedIndex = 1;
  }


}
