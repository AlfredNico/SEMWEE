import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { DataSources } from '../../interfaces/data-sources';

@Component({
  selector: 'app-lp-viewer',
  templateUrl: './lp-viewer.component.html',
  styleUrls: ['./lp-viewer.component.scss'],
})
export class LpViewerComponent implements OnInit, AfterViewInit {

  user: User = undefined;
  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  public dataAfterUploaded: any | undefined;


  constructor(private auth: AuthService) {
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnInit(): void { }

  ngAfterViewInit() { }

  public nextReadFile(value: any) {
    this.dataAfterUploaded = value;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }
}
