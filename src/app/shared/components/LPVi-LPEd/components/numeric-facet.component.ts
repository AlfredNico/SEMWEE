import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { LpViwersService } from "@app/user-spaces/dashbord/services/lp-viwers.service";

@Component({
    selector: "app-numeric-facet",
    template: `
        <div class="ml-5 mgb-30 sub-panel">
            <div class="p-0 w-100">
                <div class="pd-8-18 level1 border-level1" fxLayout="row">
            <span class="ftp title-text">{{ item["head"] }}</span>
            <span fxFlex></span>
            <div
                class="pointer px-1 reset-text ftp"
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
                    class="custom-slider"
                    *ngIf="item?.maxValue !== 0 && item['isMinimize'] === false"
                >
                    <ngx-slider
                        [(value)]="item.minValue"
                        [(highValue)]="item.maxValue"
                        [options]="item.options"
                        (userChangeEnd)="userChangeEnd($event)"
                    ></ngx-slider>
                </div>
                <div
                    fxLayout="row"
                    fxLayoutAlign="center center"
                    class="numeric-text"
                    *ngIf="item?.maxValue !== 0 && item['isMinimize'] === false"
                >
                    <p class="m-0 ftp fw-600">{{ item?.minValue }}</p>
                    <p class="mx-1 my-0 ftp fw-600">-</p>
                    <p class="m-0 ftp fw-600">{{ item?.maxValue }}</p>
                </div>
            </div>
        </div>
    `,
    styleUrls: ["./facet-filter.component.scss"],
})
export class NumericFacetComponent {
    /* INPUT */
    @Input("items") items: any[] = [];
    @Input("item") item: any = undefined;
    @Input("dataViews") public dataViews: any[] = [];

    /* OUTPUT */
    @Output("numericQueriesEmitter") numericQueriesEmitter =
        new EventEmitter<any>(undefined);
    @Output("itemsEmitter") itemsEmitter: any = new EventEmitter();
    @Output("minimize") minimize: any = new EventEmitter();
    @Output("removeFromItem") removeFromItem: any = new EventEmitter();
    @Output("resetFacet") resetFacet: any = new EventEmitter();

    /* VARIALBES */

    constructor() { }

    userChangeEnd(event: any) {
        const valueFiltered = {
            minValue: event["value"],
            maxValue: event["highValue"],
            head: this.item["head"],
        };

        this.numericQueriesEmitter.emit(valueFiltered);
    }

    public reset(): void {
        this.item = {
            ...this.item,
            minValue: this.item.min,
            maxValue: this.item.max,
        };
        this.resetFacet.emit(this.item);
    }
}
