import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { ResizeEvent } from "angular-resizable-element";
import { Observable, of, Subject } from "rxjs";

@Component({
    selector: "app-search-filter",
    template: `
    <div class="mx-1 pl-3 mgb-30 sub-panel" appFluidHeight>
    <div class="p-0 w-100">
            <div class="pd-8-18 level1 border-level1" fxLayout="row">
                <span class="ftp title-text">{{ item["head"] }}</span>
                <span fxFlex></span>
                <div
                    class="pointer px-1 reset-text"
                    (click)="reset()"
                >
                    Reset
                </div>
                <span class="svg-icon svg-icon-custom" style="margin-right: 18px;" *ngIf="item['isMinimize'] === false"
                    aria-label="close icon"
                    (click)="minimize.emit(item)">
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.07252 6.81434L0.177077 1.68092C-0.0590258 1.43335 -0.0590258 1.03196 0.177077 0.784405L0.748052 0.185678C0.983752 -0.0614781 1.36575 -0.0619538 1.60201 0.184621L5.50001 4.25294L9.39799 0.184621C9.63425 -0.0619538 10.0162 -0.0614781 10.2519 0.185678L10.8229 0.784405C11.059 1.03198 11.059 1.43337 10.8229 1.68092L5.92751 6.81434C5.6914 7.06189 5.30862 7.06189 5.07252 6.81434Z" fill="#3B85FE"/>
                    </svg>
                </span>
                <span class="svg-icon svg-icon-custom svg-rotate" style="margin-right: 18px;" *ngIf="item['isMinimize'] === true"
                    aria-label="close icon"
                    (click)="minimize.emit(item)">
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.07252 6.81434L0.177077 1.68092C-0.0590258 1.43335 -0.0590258 1.03196 0.177077 0.784405L0.748052 0.185678C0.983752 -0.0614781 1.36575 -0.0619538 1.60201 0.184621L5.50001 4.25294L9.39799 0.184621C9.63425 -0.0619538 10.0162 -0.0614781 10.2519 0.185678L10.8229 0.784405C11.059 1.03198 11.059 1.43337 10.8229 1.68092L5.92751 6.81434C5.6914 7.06189 5.30862 7.06189 5.07252 6.81434Z" fill="#3B85FE"/>
                    </svg>
                </span>
                <span class="svg-icon svg-icon-custom" aria-label="close icon"
                    (click)="removeFromItem.emit(item)">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.6669 5.50017L10.1925 1.97456L10.9196 1.24751C11.0268 1.14025 11.0268 0.965968 10.9196 0.858715L10.1416 0.0807838C10.0344 -0.0264695 9.86009 -0.0264695 9.75284 0.0807838L5.50017 4.33345L1.24751 0.08044C1.14025 -0.0268133 0.965968 -0.0268133 0.858714 0.08044L0.08044 0.858371C-0.0268133 0.965624 -0.0268133 1.13991 0.08044 1.24716L4.33345 5.50017L0.08044 9.75284C-0.0268133 9.86009 -0.0268133 10.0344 0.08044 10.1416L0.858371 10.9196C0.965624 11.0268 1.13991 11.0268 1.24716 10.9196L5.50017 6.6669L9.02578 10.1925L9.75284 10.9196C9.86009 11.0268 10.0344 11.0268 10.1416 10.9196L10.9196 10.1416C11.0268 10.0344 11.0268 9.86009 10.9196 9.75284L6.6669 5.50017Z" fill="#3B85FE"/>
                    </svg>
                </span>
            </div>
            <div
                fxLayout="row"
                class="pdt pdb-8 pdx level2"
                *ngIf="item['isMinimize'] === false"
            >
                <div class="pointer choice-text">
                    {{ observable$ | async }} choices
                </div>
                <div style="text-indent: 12px; width: 202px; height: 22px;">
                    Sort by :
                    <span
                        class="px-1 pointer"
                        [ngClass]="
                            isSortName ? 'sort-active' : 'sort-inactive'
                        "
                        (click)="sortByName()"
                        >name</span
                    >
                    <span
                        class="px-1 pointer"
                        [ngClass]="
                            isSortCount ? 'sort-active' : 'sort-inactive'
                        "
                        (click)="sortByCount()"
                        >count</span
                    >
                </div>
            </div>
            <div
                class="pt-0" [ngStyle]="{ height: ht + 'px' }"
                style="overflow: auto; font-size: 11px; background: white; border-bottom: 7px solid white;"
                *ngIf="item['isMinimize'] === false"
                mwlResizable
                [enableGhostResize]="true"
                [resizeEdges]="{bottom: true}"
                (resizeEnd)="onResizeEnd($event)"
            >
                <div
                    fxLayout="row"
                    class="py-0 pdx list-content include-exclude"
                    fxLayoutAlign="space-between center"
                    *ngFor="let content of item?.content"
                >
                    <div fxLayout="row">
                        <p
                            class="m-0 pr-2 pointer"
                            [ngClass]="
                                content['include'] == false ? 'include-active' : 'exclude-active'
                            " (click)="include(item, content[0])"
                        >
                            {{ content[0] }}
                        </p>
                        <span style="color: #959CBD; text-indent: 0;">
                            {{ content[1] }}
                        </span>
                    </div>
                    <span
                        class="only-show-on-hover pointer in-ex include-hov"
                        *ngIf="content['include'] === false"
                        (click)="include(item, content[0])"
                    >
                        include
                    </span>
                    <span
                        class="only-show-on-hover pointer in-ex include-hov"
                        *ngIf="content['include'] === true"
                        (click)="exclude(item, content[0])"
                    >
                        exclude
                    </span>
                </div>
            </div>
            <div style="height: auto; background: white; position: relative; top: -7px; z-index: -1;" *ngIf="item['isMinimize'] === false">
                <div style="display: flex; justify-content: center;">
                    <span class="svg-icon svg-icon-point mgr-3">
                        <svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="1.5" cy="1.5" r="1.5" fill="#C4C4C4"/>
                        </svg>
                    </span>
                    <span class="svg-icon svg-icon-point mgr-3">
                        <svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="1.5" cy="1.5" r="1.5" fill="#C4C4C4"/>
                        </svg>
                    </span>
                    <span class="svg-icon svg-icon-point">
                        <svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="1.5" cy="1.5" r="1.5" fill="#C4C4C4"/>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </div>
    `,
    styleUrls: ["./facet-filter.component.scss"],
})
export class SearchFilterComponent implements AfterViewInit {
    /* INPUT */
    @Input("items") items: any[] = [];
    @Input("dataViews") dataViews: any[] = [];
    @Input("item") item: any = undefined;
    @Input("index") index: any = undefined;

    /* OUTPUT */
    @Output("minimize") minimize: any = new EventEmitter();
    @Output("removeFromItem") removeFromItem: any = new EventEmitter();
    @Output("itemsEmitter") itemsEmitter: any = new EventEmitter();

    //VARIABLE
    public couter: number;
    public isSortName: boolean = false;
    public isSortCount: boolean = false;
    private itemSubject = new Subject();
    public observable$: Observable<number>;
    public ht: any;

    constructor() { }

    ngAfterViewInit(): void {
        this.itemSubject.subscribe(
            (_) => (this.observable$ = of(this.couterInclude()))
        );

        setTimeout(() => {
            this.ht = 154;
        }, 0);
    }

    public exclude(headName: any, contentName: string) {
        const index = this.items.indexOf(headName);
        if (index !== -1) {
            this.items[index].content.map((val: any, i: number) => {
                if (val[0] === contentName) {
                    this.items[index].content[i] = {
                        ...this.items[index].content[i],
                        include: !this.items[index].content[i]["include"],
                    };
                }
            });
        }
        this.itemSubject.next();

        this.itemsEmitter.emit(this.items);
    }

    public include(headName: any, contentName: string) {
        const index = this.items.indexOf(headName);
        if (index !== -1) {
            this.items[index].content.map((val, i) => {
                if (val[0] === contentName) {
                    this.items[index].content[i] = {
                        ...this.items[index].content[i],
                        include: !this.items[index].content[i]["include"],
                    };
                }
            });
        }
        this.itemSubject.next();
        this.itemsEmitter.emit(this.items);
    }

    public sortByName(): void {
        this.isSortName = !this.isSortName;
        this.items[this.index].content.sort((prev, next) =>
            this.isSortName ? this.ASC(prev, next, 0) : this.DESC(prev, next, 0)
        );
    }
    public sortByCount(): void {
        this.isSortCount = !this.isSortCount;
        this.items[this.index].content.sort((prev, next) =>
            this.isSortCount
                ? this.ASC(prev, next, 1)
                : this.DESC(prev, next, 1)
        );
    }

    private DESC(i, ii, key): number {
        return i[key] > ii[key] ? -1 : i[key] < ii[key] ? 1 : 0;
    }

    private ASC(i, ii, key): number {
        return i[key] > ii[key] ? 1 : i[key] < ii[key] ? -1 : 0;
    }

    private couterInclude(): number {
        this.couter = 0;
        this.items[this.index].content.forEach((element) => {
            if (element.include) {
                this.couter++;
            }
        });
        return this.couter;
    }

    public reset(): void {
        this.item.content.forEach((element) => {
            element.include = false;
        });
        const index = this.items.indexOf(this.item.head);
        if (index != -1) {
            this.items[index] = this.item;
        }
        this.itemSubject.next();
        this.itemsEmitter.emit(this.items);
    }

    onResizeEnd(e: ResizeEvent) {
        this.ht = e.rectangle.height > 154 ? e.rectangle.height : 154;
    }
}
