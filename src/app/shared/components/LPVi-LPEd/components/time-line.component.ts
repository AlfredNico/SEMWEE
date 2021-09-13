import { DatePipe } from "@angular/common";
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";

@Component({
    selector: "app-time-line",
    template: `
        <div class="ml-5 mgb-30 sub-panel">
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
                    class="custom-slider w-100 level2"
                    style.height.px="55"
                    *ngIf="
                        (item?.endDate !== undefined ||
                            item?.startDate !== undefined) &&
                        item['isMinimize'] === false
                    "
                    fxLayout="row"
                    fxLayoutAlign="space-between center"
                    [formGroup]="FormRange"
                >
                    <mat-form-field
                        appearance="fill"
                        class="w-50"
                        style="background: #FFFFFF;"
                    >
                        <mat-label>start date</mat-label>
                        <input
                            matInput
                            [matDatepicker]="startPicker"
                            formControlName="start"
                            [max]="end"
                        />
                        <mat-datepicker-toggle
                            matSuffix
                            [for]="startPicker"
                        ></mat-datepicker-toggle>
                        <mat-datepicker #startPicker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="w-50">
                        <mat-label>end date</mat-label>
                        <input
                            matInput
                            [matDatepicker]="endPicker"
                            formControlName="end"
                            [min]="start"
                        />
                        <mat-datepicker-toggle
                            matSuffix
                            [for]="endPicker"
                        ></mat-datepicker-toggle>
                        <mat-datepicker #endPicker></mat-datepicker>
                    </mat-form-field>
                </div>
                <div
                    [style.height.px]="10"
                    style="background: white"
                    *ngIf="item['isMinimize'] === false"
                    class="rounded-bottom"
                ></div>
            </div>
        </div>
    `,
    styles: [
        `
            ::ng-deep .mat-form-field-wrapper {
                // background: white !important;
            }

            ::ng-deep .mat-label,
            .mat-datepicker-input {
                font-family: Poppins !important;
                font-weight: 600;
            }

            ::ng-deep .mat-form-field-appearance-fill .mat-form-field-flex {
                background-color: #FFFFFF;
                border-radius: 0 !important;
            }

            ::ng-deep .mat-form-field-appearance-fill {
            }
            .sub-panel {
                box-shadow: 0px 0px 15px 1px rgb(113 106 202 / 10%);
                margin-left: 32px !important;
                margin-right: 18px !important;
            }

            
        `,
    ],
    providers: [DatePipe],
})
export class TimeLineComponent implements AfterViewInit, OnInit {
    /* INPUT */
    @Input("items") items: any[] = [];
    @Input("item") item: any = undefined;

    /* OUTPUT */
    @Output("timeLineQueriesEmitter") timeLineQueriesEmitter =
        new EventEmitter<any>(undefined);
    @Output("itemsEmitter") itemsEmitter: any = new EventEmitter();
    @Output("minimize") minimize: any = new EventEmitter();
    @Output("removeFromItem") removeFromItem: any = new EventEmitter();
    @Output("resetFacet") resetFacet: any = new EventEmitter();

    /* VARIALBES */

    FormRange = new FormGroup({
        start: new FormControl("", [Validators.required]),
        end: new FormControl([Validators.required]),
    });

    constructor(private dateAdapter: DateAdapter<Date>) {
        this.dateAdapter.setLocale("en-US");
    }

    ngOnInit(): void {
        this.FormRange.patchValue({
            start: this.item["startDate"],
            end: this.item["endDate"],
        });
    }

    get end() {
        return this.FormRange.get("end").value;
    }

    get start() {
        return this.FormRange.get("start").value;
    }

    ngAfterViewInit(): void {
        this.FormRange.valueChanges.subscribe((query) => {
            this.timeLineQueriesEmitter.emit({
                head: this.item["head"],
                start: Date.parse(query["start"]),
                end: Date.parse(query["end"]),
            });
        });
    }

    public isValidDate() {
        return !(
            this.item["startDate"].length == 25 &&
            this.item["endDate"].length == 25
        );
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
