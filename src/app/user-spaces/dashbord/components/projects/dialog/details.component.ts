import { CommonService } from '@app/shared/services/common.service';
import { IdbService } from './../../../../../services/idb.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { NotificationService } from '@app/services/notification.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { EditComponent } from './edit.component';
import { RemoveComponent } from './remove.component';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  public image_url: any;
  public isBtnCatalog = false;
  public loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Projects,
    public dialog: MatDialog,
    private projectServices: ProjectsService,
    private notifs: NotificationService,
    private triggerServices: TriggerService,
    private idb: IdbService
  ) {
    this.image_url = environment.baseUrlImg + this.data.image_project_Squared;
    if (this.data.product.length > 0) {
      this.isBtnCatalog = true;
    }
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

  deleteCatalogue(item: Projects) {
    this.dialog
      .open(RemoveComponent, {
        data: {
          message: 'Are you sure to delete all the catalogs of this project ?',
        },
        width: '600px',
      })
      .afterClosed()
      .pipe(
        map((result) => {
          if (result === true) {
            this.loading = true;
            this.idb.deleteItem('infetList', this.data['_id']);
            this.idb.deleteItem('checkRevelancy', this.data['_id']),
              this.projectServices
                .deleteCatalogue(item._id)
                .subscribe((result) => {
                  if (result && result.message) {
                    this.projectServices.refresh$.next(true);
                    this.triggerServices.trigrer$.next(true);
                    this.notifs.sucess(result.message);
                    this.isBtnCatalog = false;
                    this.loading = false;
                  }
                });
          }
        })
      )
      .subscribe();
  }
}
