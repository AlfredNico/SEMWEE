import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pulsing-skeleton',
  template: `
    <table class="w-100 table-viewer">
      <tr [style.background]="'#FFFFFF'">
        <th class="border-bottom" *ngFor="let td of [0, 1, 2, 3, 4]">
          <img
            src="assets/images/gif/skeleton.gif"
            width="150"
            height="30"
            class="mx-5 my-5 rounded"
          />
        </th>
      </tr>
      <tr
        *ngFor="
          let tr of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
          let even = even;
          let odd = odd
        "
        [class.odd]="odd"
        [class.even]="even"
        class="my-5"
      >
        <td class="border-bottom" *ngFor="let td of [0, 1, 2, 3, 4]">
          <img
            src="assets/images/gif/skeleton.gif"
            width="150"
            height="20"
            class="mx-5 my-4 rounded"
          />
        </td>
      </tr>
    </table>
  `,
  styles: [
    `
      .odd {
        background: #F5F5F9;
      }
      .even {
        background: #FFFFFF;
      }
    `,
  ],
})
export class PulsingSkeletonComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
