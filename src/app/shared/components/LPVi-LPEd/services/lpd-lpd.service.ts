import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "@app/shared/services/common.service";
import { environment } from "@environments/environment";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class LpdLpdService {
    /* Emittter value from clicked USER */
    public itemsObservables$ = new BehaviorSubject<any>(undefined);
    public searchReplace$ = new BehaviorSubject<any>(undefined);
    public resetfilter = new Subject<any>();
    /* Emittter value dataSources after filter USER */
    public dataSources$ = new BehaviorSubject<any>(undefined);
    public dataPaginator$ = new BehaviorSubject<boolean>(false);
    public inputSubject = new Subject();

    // data: [],
    public permaLink = {
        input: [],
        numeric: [],
        search: [],
        items: [],
        name: [],
        queries: {},
        queriesNumerisFilters: {},
        queriesTimeLineFilters: {},
    };

    public formInputQuery = {};

    public isLoading$ = new BehaviorSubject<boolean>(true);

    private readonly ROUTER_URL = `${environment.baseUrl}/lpviewer`;

    constructor(
        private http: HttpClient,
        private readonly common: CommonService
    ) {
        this.isLoading$.subscribe((res) => {
            if (res === true) this.common.showSpinner("table", true, "");
            else
                setTimeout(() => {
                    this.common.hideSpinner("table");
                }, 500);
        });
    }

    public getSavedProjects(idProject): Observable<any> {
        return this.http
            .get<any>(`${this.ROUTER_URL}/get-permalink/${idProject}`)
            .pipe(
                map((res) => {
                    if (res[3].length !== 0)
                        this.permaLink = { ...JSON.parse(res[3][0]["value"]) };

                    if (res[2].length !== 0)
                        this.formInputQuery = {
                            ...JSON.parse(res[2][0]["value"]),
                        };

                    const header = JSON.parse(
                        JSON.stringify(
                            res[0][0]?.nameUpdate.split('"').join("")
                        )
                    ).split(",");

                    header.unshift("all");
                    return {
                        headerOrigin: header,
                        data: res[1],
                        formInputQuery: this.formInputQuery,
                        permaLink: this.permaLink,
                        name: res[4],
                        projectName: res[5],
                    };
                })
            );
    }

    //remove-all-projects
    public removeAllProjects(idUser: string) {
        return this.http.post<{ message: string }>(
            `${this.ROUTER_URL}/remove-all-projects`,
            { idUser: idUser }
        );
    }
}
