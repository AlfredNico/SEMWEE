import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { EditComponent } from './edit.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  public image_url: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Projects,
    public dialog: MatDialog
  ) {
    console.log(this.data);
    this.image_url = environment.baseUrlImg + this.data.image_project_Squared;
  }

  ngOnInit(): void {
    this.data.name_project;
  }

  onEdit(item: Projects) {
    this.dialog.open(EditComponent, {
      data: item,
      width: '75%',
    });
  }
}
