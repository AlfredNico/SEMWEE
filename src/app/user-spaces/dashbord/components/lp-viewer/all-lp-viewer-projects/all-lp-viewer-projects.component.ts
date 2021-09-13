import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { AuthService } from "@app/authentification/services/auth.service";
import { User } from "@app/classes/users";
import { NotificationService } from "@app/services/notification.service";
import { LpdLpdService } from "@app/shared/components/LPVi-LPEd/services/lpd-lpd.service";
import { LPAllProjects } from "@app/user-spaces/dashbord/interfaces/lp-viewer-projects";
import { LPViewerProjectsService } from "@app/user-spaces/dashbord/services/lp-viewer.service";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RemoveComponent } from "../../projects/dialog/remove.component";

@Component({
    selector: "app-all-lp-viewer-projects",
    templateUrl: "./all-lp-viewer-projects.component.html",
    styleUrls: ["./all-lp-viewer-projects.component.scss"],
})
export class AllLPViewerProjectsComponent implements OnInit, AfterViewInit {
    public allProjects$: Observable<LPAllProjects[]>;
    private user!: User;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private LPViewerProjectsService: LPViewerProjectsService,
        public dialog: MatDialog,
        private notifs: NotificationService,
        private auth: AuthService,
        private router: Router,
        private readonly lpviLped: LpdLpdService
    ) {
        this.user = this.auth.currentUserSubject.value;
    }

    ngOnInit(): void {
        this.allProjects$ = this.LPViewerProjectsService.refresh$.pipe(
            switchMap((_) =>
                this.LPViewerProjectsService.getAllProjects(this.user._id)
            )
        );
        this.lpviLped.isLoading$.next(false);
    }

    ngAfterViewInit() {
        this.allProjects$.subscribe(
            (result: any[]) => {
                if (result && result.length == 0) {
                    this.lpviLped.isLoading$.next(false); // disable loading spinner
                    this.router.navigateByUrl("/user-space/lp-viewer");
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.notifs.warn(error.message);
                }
                this.lpviLped.isLoading$.next(false); // disable loading spinner
                this.router.navigateByUrl("/user-space/lp-viewer");
            }
        );
        this.lpviLped.isLoading$.next(false); // disable loading spinner
    }

    public removeAllProjects() {
        this.dialog
            .open(RemoveComponent, {
                data: {
                    message: "Are you sure to delete all projects ?",
                },
                width: "600px",
            })
            .afterClosed()
            .pipe(
                map((result) => {
                    if (result === true) {
                        this.lpviLped
                            .removeAllProjects(this.user._id)
                            .subscribe((result) => {
                                if (result && result.message) {
                                    this.notifs.sucess(result.message);
                                    this.LPViewerProjectsService.refresh$.next(
                                        true
                                    );
                                    this.LPViewerProjectsService.trigrer$.next(
                                        true
                                    );
                                }
                            });
                    }
                })
            )
            .subscribe();
    }
}
