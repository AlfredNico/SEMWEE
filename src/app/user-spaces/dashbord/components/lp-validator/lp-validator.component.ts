import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { AuthService } from '@app/authentification/services/auth.service';
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

  public selectedIndex = 0;
  public dataSources!: { displayColumns: string[], hideColumns: string[], data: any[] };
  
  constructor(private auth: AuthService) { }

  public dataInferList = [];

  ngOnInit(): void {
  }

  selectionChange(stepper: any) {
    console.log('item', stepper);
  }

  // Upload file ok
  public UploadFileReady(event: any) {
    this.dataSources = event;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  public inferListReady(event: any) {
    this.dataInferList = event;

    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  @HostListener('window:scroll') checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }


}
