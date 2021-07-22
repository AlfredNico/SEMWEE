import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { LpEditorService } from "@app/user-spaces/dashbord/services/lp-editor.service";
import { LpdLpdService } from "../services/lpd-lpd.service";

@Component({
    selector: "app-facet-filter-target",
    template: `
        <div *ngIf="items.length > 0; else noItems">
            <div class="w-100 pl-4 pr-2 pb-3" style="margin-top:5px">
                <button class="rounded btn btn-custom">Refresh</button>
                <span fxFlex></span>
                <button
                    class="rounded btn btn-custom mr-2"
                    (click)="resetAll()"
                >
                    Reset All
                </button>
                <button class="rounded btn btn-custom" (click)="removeAll()">
                    Remove All
                </button>
            </div>

            <div *ngFor="let item of items; let index = index">
                <ng-container
                    *ngTemplateOutlet="
                        item.type === 'search'
                            ? searchTemplate
                            : item.type === 'input'
                            ? inputTemplate
                            : item.type === 'datefilter'
                            ? dateTemplate
                            : item.type === 'numeric'
                            ? numericTemplate
                            : timeLineTemplate;
                        context: { value: item }
                    "
                >
                </ng-container>

                <ng-template #searchTemplate let-currentValue="value">
                    <app-search-filter
                        [items]="items"
                        [item]="item"
                        [index]="index"
                        [dataViews]="dataViews"
                        (itemsEmitter)="itemsEmitter($event)"
                        (removeFromItem)="
                            removeFromItemEmitter($event, 'search')
                        "
                        (minimize)="minimizeEmitter($event)"
                    ></app-search-filter>
                </ng-template>

                <ng-template #inputTemplate let-currentValue="value">
                    <app-input-filter
                        [items]="items"
                        [item]="item"
                        [index]="index"
                        [dataViews]="dataViews"
                        (formGroup)="formGroupEmitter($event)"
                        (removeFromItem)="
                            removeFromItemEmitter($event, 'input')
                        "
                        (minimize)="minimizeEmitter($event)"
                        (itemsEmitter)="itemsEmitter($event)"
                    ></app-input-filter>
                </ng-template>

                <ng-template #dateTemplate let-currentValue="value">
                    <app-date-filter
                        [items]="items"
                        [item]="item"
                        [index]="index"
                        [dataViews]="dataViews"
                        (formGroup)="formGroupEmitter($event)"
                        (removeFromItem)="
                            removeFromItemEmitter($event, 'input')
                        "
                        (minimize)="minimizeEmitter($event)"
                        (itemsEmitter)="itemsEmitter($event)"
                    ></app-date-filter>
                </ng-template>

                <ng-template #numericTemplate let-currentValue="value">
                    <app-numeric-facet
                        [items]="items"
                        [item]="item"
                        [dataViews]="dataViews"
                        [dataSources]="dataSources"
                        (numericQueriesEmitter)="callAfterNumericFilter($event)"
                        (removeFromItem)="
                            removeFromItemEmitter($event, 'numeric')
                        "
                        (minimize)="minimizeEmitter($event)"
                        (resetFacet)="resetTimeLineAndNumber($event, 'numeric')"
                    ></app-numeric-facet>
                </ng-template>

                <ng-template #timeLineTemplate let-currentValue="value">
                    <app-time-line
                        [items]="items"
                        [item]="item"
                        [dataViews]="dataViews"
                        [dataSources]="dataSources"
                        (timeLineQueriesEmitter)="
                            callAfterTimeLineEmitter($event)
                        "
                        (removeFromItem)="
                            removeFromItemEmitter($event, 'timeLine')
                        "
                        (minimize)="minimizeEmitter($event)"
                        (resetFacet)="
                            resetTimeLineAndNumber($event, 'timeLine')
                        "
                    ></app-time-line>
                </ng-template>
            </div>
        </div>

        <ng-template #noItems>
            <div style="background: #F5F6FA;" class="w-100 ml-4 px-3 py-5">
                <h1 class="ftp">Using facets and filters</h1>
                <p class="m-0 ftp">
                    Use facets and filters to select subsets of your data to act
                    on. Choose facet and filter methods from the menus at the
                    top of each data column.
                </p>
            </div>
        </ng-template>
    `,
    styleUrls: ["./facet-filter.component.scss"],
})
export class FacetFilterComponent implements AfterViewInit, OnInit, OnDestroy {
    /* VARIABLES */
    private queries = {};
    public Columns = "";
    /* ALL QUERY FILTERS VALUES */
    private inputQueries: boolean[] = [];
    private searchQueries: boolean[] = [];
    private numericQeury: boolean[] = [];
    private timeLineQeury: boolean[] = [];
    private queriesNumerisFilters = {};
    private queriesTimeLineFilters = {};

    // public items: any[] = [];

    /* INPUT */
    @Input("dataViews") public dataViews: any[] = [];
    @Input("dataSources") public dataSources: any[] = [];
    @Input("idProject") public idProject = undefined;
    @Input("items") public items: any[] = [];

    search_replace: any[] = [];

    constructor(
        private readonly lpEditor: LpEditorService,
        private readonly lpviLped: LpdLpdService
    ) {}

    ngOnInit(): void {
        if (Object.keys(this.lpviLped.permaLink).length !== 0) {
            this.inputQueries = this.lpviLped.permaLink["input"];
            this.searchQueries = this.lpviLped.permaLink["search"];
            this.numericQeury = this.lpviLped.permaLink["numeric"];
            this.items = this.lpviLped.permaLink["items"];
            this.queries = this.lpviLped.permaLink["queries"];
            this.queriesNumerisFilters =
                this.lpviLped.permaLink["queriesNumerisFilters"];
            this.queriesTimeLineFilters =
                this.lpviLped.permaLink["queriesTimeLineFilters"];
        }
    }

    ngOnDestroy(): void {}

    ngAfterViewInit(): void {
        this.lpviLped.resetfilter.subscribe((res: any) => {
            this.resetAll();
        });
        this.lpviLped.itemsObservables$.subscribe((res: any) => {
            if (res !== undefined) {
                this.items.push(res);
                this.savePermalink(); // SAVE PERMALINK
            }
        });
    }

    public removeAll() {
        this.lpviLped.dataSources$.next(this.dataViews);
        this.items = [];
        this.inputQueries = [];
        this.searchQueries = [];
        this.numericQeury = [];
        this.dataSources = this.dataViews;
        this.queries = {};
        this.queriesNumerisFilters = {};
        Object.keys(this.lpviLped.permaLink.queries).forEach(
            (v) => (this.lpviLped.permaLink.queries[v] = "")
        );

        this.savePermalink(); // SAVE PERMALINK
    }

    public resetAll() {
        // console.log("reset all")
        this.inputQueries = [];
        this.searchQueries = [];
        this.numericQeury = [];
        Object.keys(this.queries).forEach((v) => (this.queries[v] = ""));
        Object.keys(this.lpviLped.permaLink.queries).forEach(
            (v) => (this.lpviLped.permaLink.queries[v] = "")
        );

        this.lpviLped.inputSubject.next();

        this.queriesNumerisFilters = {};
        this.lpviLped.dataSources$.next(this.dataViews);
        this.dataSources = this.dataViews;

        this.items.map((item, index) => {
            if (item["type"] === "search") {
                item["content"]?.map((value, i) => {
                    item["content"][i] = {
                        ...value,
                        include: false,
                    };
                });
            } else if (item["type"] === "input") {
                this.items[index] = {
                    ...item,
                    value: "",
                };
            } else if (item["type"] === "numeric") {
                this.items[index] = {
                    ...item,
                    options: {
                        ...item["options"],
                        floor: item.min,
                        ceil: item.max,
                    },
                    minValue: item.min,
                    maxValue: item.max,
                };
            } else if (item["type"] === "timeLine") {
                this.items[index] = {
                    ...item,
                    startDate: item.min,
                    endDate: item.max,
                };
            }
        });

        this.items = this.items;
        this.savePermalink(); // SAVE PERMALINK
    }

    /* EMITTER FUNCTION AFTER FILTER FROM COMPONENTS */
    public callAfterNumericFilter(event: any) {
        this.lpviLped.isLoading$.next(true); // enable loading spinner
        let q = [],
            ss = undefined;

        this.dataSources = this.dataViews.filter((value, index) => {
            const v = value[`${event["head"]}`];
            if (Object.keys(this.queriesNumerisFilters).length === 0) {
                if (
                    v >= event["minValue"] &&
                    v <= event["maxValue"] &&
                    Number.isFinite(v) === true
                )
                    q[index] = true;
                else q[index] = false;

                this.numericQeury[index] = q[index];
                return this.filtersData(index);
            } else {
                let queryIndex = 0;

                if (
                    v >= event["minValue"] &&
                    v <= event["maxValue"] &&
                    Number.isFinite(v) === true
                )
                    q[index] = true;
                else q[index] = false;

                Object.keys(this.queriesNumerisFilters).every((x) => {
                    if (x != `${event["head"]}`) {
                        const s = this.queriesNumerisFilters[x];
                        if (queryIndex === 0) ss = s[index];
                        else ss = s[index] && ss;
                        queryIndex++;
                    }
                });
                if (ss != undefined) this.numericQeury[index] = q[index] && ss;
                else this.numericQeury[index] = q[index];
                return this.filtersData(index);
            }
        });
        this.queriesNumerisFilters[`${event["head"]}`] = q;

        this.lpviLped.dataSources$.next(this.dataSources);
        this.savePermalink(); // SAVE PERMALINK
    }

    public callAfterTimeLineEmitter(event: any) {
        this.lpviLped.isLoading$.next(true); // enable loading spinner

        let q = [],
            ss = undefined;
        if (this.queriesTimeLineFilters == undefined)
            this.queriesTimeLineFilters = {};

        this.dataSources = this.dataViews.filter((value, index) => {
            const v = Date.parse(value[`${event["head"]}`]);
            if (Object.keys(this.queriesTimeLineFilters).length === 0) {
                if (v <= event["end"] && v >= event["start"]) q[index] = true;
                else q[index] = false;
                this.timeLineQeury[index] = ss = q[index];
                return this.filtersData(index);
            } else {
                let queryIndex = 0;
                if (v <= event["end"] && v >= event["start"]) q[index] = true;
                else q[index] = false;

                Object.keys(this.queriesTimeLineFilters).every((x) => {
                    if (x != `${event["head"]}`) {
                        const s = this.queriesTimeLineFilters[x];
                        if (queryIndex === 0) ss = s[index];
                        else ss = s[index] && ss;
                        queryIndex++;
                    }
                });

                if (ss != undefined) this.timeLineQeury[index] = q[index] && ss;
                else this.timeLineQeury[index] = q[index];
                return this.filtersData(index);
            }
        });

        this.queriesTimeLineFilters[`${event["head"]}`] = this.timeLineQeury;

        this.lpviLped.dataSources$.next(this.dataSources);
        this.savePermalink(); // SAVE PERMALINK
    }

    public formGroupEmitter(event: { query: any; item: any; index: number }) {
        this.queries[event.item["head"]] = event.query; //save querie from input filter
        const index = this.items.findIndex(
            (elem) => elem["head"] == event.item["head"]
        );

        if (index !== -1) this.items[index] = { ...event.item };

        this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
    }

    public minimizeEmitter(item: any): void {
        const index = this.items.findIndex(
            (elem) => elem["head"] == item["head"]
        );

        if (index !== -1) {
            this.items[index] = {
                ...this.items[index],
                isMinimize: !this.items[index]["isMinimize"],
            };
        }

        this.items = this.items;

        this.savePermalink(); // SAVE PERMALINK
    }

    public removeFromItemEmitter(item: any, removeName?: string): void {
        if (this.items.indexOf(item) !== -1) {
            this.items.splice(this.items.indexOf(item), 1);
        }

        this.items = this.items;

        if (removeName !== undefined) {
            if (removeName === "input") {
                const newObject = Object.keys(this.queries).reduce(
                    (accumulator, key) => {
                        if (key !== item["head"])
                            accumulator[key] = this.queries[key];
                        return accumulator;
                    },
                    {}
                );
                this.queries = newObject;

                this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
            } else if (removeName === "numeric") {
                let q = [],
                    ss = undefined;
                delete this.queriesNumerisFilters[item["head"]];
                this.dataSources = this.dataViews.filter((value, index) => {
                    if (Object.keys(this.queriesNumerisFilters).length === 0) {
                        this.numericQeury[index] = true;
                        return this.filtersData(index);
                    } else {
                        let queryIndex = 0;
                        Object.keys(this.queriesNumerisFilters).every((x) => {
                            const s = this.queriesNumerisFilters[x];
                            if (queryIndex === 0) ss = s[index];
                            else ss = s[index] && ss;
                            queryIndex++;
                        });
                        this.numericQeury[index] = ss;
                        return this.filtersData(index);
                    }
                });

                this.lpviLped.dataSources$.next(this.dataSources);
            } else if (removeName === "search") {
                // this.searchQueries = [];
                // this.dataSources = this.dataViews.filter((value, index) => {
                //   return this.filtersData(index);
                // });
                this.itemsEmitter(); // Call search filter Item after delete item
                // this.lpviLped.dataSources$.next(this.dataSources);
            } else if (removeName === "timeLine") {
                let q = [],
                    ss = undefined;
                delete this.queriesTimeLineFilters[item["head"]];
                this.dataSources = this.dataViews.filter((value, index) => {
                    if (Object.keys(this.queriesTimeLineFilters).length === 0) {
                        this.timeLineQeury[index] = true;
                        return this.filtersData(index);
                    } else {
                        let queryIndex = 0;
                        Object.keys(this.queriesTimeLineFilters).every((x) => {
                            const s = this.queriesTimeLineFilters[x];
                            if (queryIndex === 0) ss = s[index];
                            else ss = s[index] && ss;
                            queryIndex++;
                        });
                        this.timeLineQeury[index] = ss;
                        return this.filtersData(index);
                    }
                });

                this.lpviLped.dataSources$.next(this.dataSources);
            }
        }
        this.savePermalink(); // SAVE PERMALINK
    }

    public itemsEmitter(event?: any) {
        this.lpviLped.isLoading$.next(true); // enable loading spinner

        if (event !== undefined) this.items = event;

        this.dataSources = this.dataViews.filter((value, index) => {
            let i1: number = 0;
            let queries: boolean;
            const q = this.items.map((item: any): void => {
                let i2: number = 0;
                let str = "";
                item["content"]?.map((element: any) => {
                    if (element["include"] == true) {
                        const q = `value["${item["head"]}"].trim()==="${element[0]}".trim()`;
                        if (i2 == 0) str = q;
                        else str = `${str}||${q}`;
                        i2++;
                    }
                });
                if (eval(str) != (undefined || null)) {
                    if (i1 == 0) queries = eval(str);
                    else queries = queries && eval(str);
                    i1++;
                }
            });
            this.searchQueries[index] =
                queries != (undefined || null) ? queries : true;

            return this.filtersData(index);
        });

        this.lpviLped.dataSources$.next(this.dataSources);

        this.savePermalink(); // SAVE PERMALINK
    }

    public resetTimeLineAndNumber(item: any, resetName: string) {
        const index = this.items.findIndex(
            (elem) => elem["head"] == item["head"]
        );
        if (index != -1) {
            this.items[index] = item;
            if (resetName == "numeric") {
                this.callAfterNumericFilter(item);
            } else {
                this.callAfterTimeLineEmitter({
                    head: this.items[index].head,
                    start: Date.parse(this.items[index].min),
                    end: Date.parse(this.items[index].max),
                });
            }
        }
    }

    /* VERIFY ALL QUERY FILTERS */
    private chechQueryFilter(index: number, queries: boolean[]): boolean {
        if (queries.length !== 0) return queries[index];
        return true;
    }

    private filtersData(index: number): boolean {
        const q1 = this.chechQueryFilter(index, this.numericQeury);
        const q2 = this.chechQueryFilter(index, this.searchQueries);
        const q3 = this.chechQueryFilter(index, this.inputQueries);
        const q4 = this.chechQueryFilter(index, this.timeLineQeury);

        return q1 && q2 && q3 && q4;
    }

    private inputFilterFonciont() {
        let qqq = false,
            i1 = 0;
        this.lpviLped.isLoading$.next(true); // disable loading spinner

        this.dataSources = this.dataViews.filter((value, index) => {
            if (
                Object.values(this.queries).every((x) => x === null || x === "")
            ) {
                this.inputQueries[index] = true;

                return this.filtersData(index);
            } else {
                let s = true,
                    i2 = 0;
                Object.keys(this.queries).some((property) => {
                    if (
                        this.queries[property] != "" &&
                        typeof value[property] === "string" &&
                        this.queries[property] !== undefined &&
                        this.queries[property]["value"] !== undefined &&
                        value[property] !== undefined
                    ) {
                        const lower = this.queries[
                            property
                        ].value.trim() as string;
                        const tabQuer = value[property] as string;
                        let ss = true;

                        if (this.queries[property].complete_string) {
                            //true
                            if (this.queries[property].sensitive) {
                                //true
                                if (this.queries[property].invert) {
                                    ss = tabQuer == lower;
                                } else {
                                    ss = !(
                                        tabQuer.toLowerCase() ==
                                        lower.toLowerCase()
                                    );
                                }
                            } else {
                                if (this.queries[property].invert) {
                                    ss =
                                        tabQuer.toLowerCase() ==
                                        lower.toLowerCase();
                                } else {
                                    ss = !(
                                        tabQuer.toLowerCase() ==
                                        lower.toLowerCase()
                                    );
                                }
                            }
                        } else {
                            if (!this.queries[property].sensitive) {
                                if (this.queries[property].invert) {
                                    ss = tabQuer
                                        .toLowerCase()
                                        .includes(lower.toLowerCase());
                                } else
                                    ss = !tabQuer
                                        .toLowerCase()
                                        .includes(lower.toLowerCase());
                            } else {
                                if (this.queries[property].invert) {
                                    ss = tabQuer.includes(lower);
                                } else {
                                    ss = !tabQuer.includes(lower);
                                }
                            }
                        }

                        if (i2 === 0) {
                            s = ss;
                        } else {
                            s = s && ss;
                        }
                        i2++;
                    }
                });
                if (i1 === 0) {
                    qqq = s;
                } else {
                    qqq = qqq && s;
                }
                i2++;
                this.inputQueries[index] = qqq !== undefined ? qqq : true;
                return this.filtersData(index);
            }
        });
        this.lpviLped.dataSources$.next(this.dataSources);
        this.savePermalink(); // SAVE PERMALINK
    }

    private savePermalink(): void {
        const permalink = {
            idProject: this.idProject,
            value: JSON.stringify({
                input: this.inputQueries,
                search: this.searchQueries,
                numeric: this.numericQeury,
                items: this.items,
                queries: this.queries,
                queriesNumerisFilters: this.queriesNumerisFilters,
            }),
        };

        this.lpviLped.permaLink = {
            ...this.lpviLped.permaLink,
            input: this.inputQueries,
            search: this.searchQueries,
            numeric: this.numericQeury,
            items: this.items,
            queries: this.queries,
            queriesNumerisFilters: this.queriesNumerisFilters,
            queriesTimeLineFilters: this.queriesTimeLineFilters,
        };

        this.lpviLped.isLoading$.next(false); // desaable loading spinner
        this.lpEditor.addFilter(permalink).subscribe();
    }
}
