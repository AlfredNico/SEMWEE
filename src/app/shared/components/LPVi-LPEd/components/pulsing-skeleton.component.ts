import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pulsing-skeleton',
  template: `
    <table class="w-100 table-viewer">
      <tr>
        <th class="border-bottom" *ngFor="let td of [0, 1, 2, 3, 4]">
          <img
            src="assets/images/gif/skeleton.gif"
            width="150"
            height="30"
            class="mx-5 mt-3 my-6 rounded"
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
      >
        <td class="border-bottom" *ngFor="let td of [0, 1, 2, 3, 4]">
          <img
            src="assets/images/gif/skeleton.gif"
            width="150"
            height="20"
            class="mx-5 mt-3 my-3 rounded"
          />
        </td>
      </tr>
    </table>
  `,
  styles: [
    `
      .odd {
        background: #f5f6fa;
      }
      .even {
        background: #fff;
      }
    `,
  ],
})
export class PulsingSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
