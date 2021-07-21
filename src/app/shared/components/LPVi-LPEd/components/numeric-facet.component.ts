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
        <div class="ml-5 pb-2">
            <div class="p-0 w-100 rounded style-border">
                <div class="py-2 px-2 level1" fxLayout="row">
                    <mat-icon
                        aria-label="close icon"
                        (click)="removeFromItem.emit(item)"
                    >
                        highlight_off
                    </mat-icon>
                    <mat-icon
                        *ngIf="item['isMinimize'] === false"
                        aria-label="close icon"
                        (click)="minimize.emit(item)"
                    >
                        remove_circle_outline
                    </mat-icon>
                    <mat-icon
                        *ngIf="item['isMinimize'] === true"
                        aria-label="close icon"
                        (click)="minimize.emit(item)"
                    >
                        add_circle_outline
                    </mat-icon>
                    <span class="fw-600">{{ item["head"] }}</span>
                    <span fxFlex></span>
                    <div
                        class="pointer px-1 white-color fw-600"
                        (click)="reset()"
                    >
                        reset
                    </div>
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
                    class="py-1 level2 rounded-bottom"
                    *ngIf="item?.maxValue !== 0 && item['isMinimize'] === false"
                >
                    <p class="m-0 ftp fw-600">{{ item?.minValue }}</p>
                    <p class="mx-1 my-0 ftp fw-600">-</p>
                    <p class="m-0 ftp fw-600">{{ item?.maxValue }}</p>
                </div>
            </div>
        </div>
    `,
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

    constructor() {}

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
