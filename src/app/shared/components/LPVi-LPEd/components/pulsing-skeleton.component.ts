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
            height="20"
            class="mx-5 mt-3 my-3 rounded"
          />
        </th>
      </tr>
      <tr *ngFor="let tr of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]">
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
      table {
        th.head,
        td.nody {
          border-bottom: 2px solid #e0e0e0;
        }
      }

      .tab-content {
        height: 200px;
        background: #777;
        margin: 20px;
      }

      .header-content {
        height: 20px;
        background: #777;
        margin: 10px 20px;
        width: 150px;
        float: left;
      }

      .header-start-content {
        height: 20px;
        background: #777;
        margin: 10px 20px;
        width: 20px;
        float: left;
      }

      .table-content {
        height: calc(100vh - 300px);
        background: #777;
        margin: 10px 20px;
      }
      section {
        float: left;
        width: 30%;
      }
      aside {
        float: right;
        width: 70%;
      }
      .br {
        border-radius: 8px;
      }
      .w80 {
        width: 80%;
      }
      .profilePic {
        height: 65px;
        width: 65px;
        border-radius: 50%;
      }
      .comment {
        height: 10px;
        background: #777;
        margin: 20px;
      }

      .header {
        height: 50px;
        background: #777;
        margin: 20px;
      }

      .wrapper {
        width: 0px;
        animation: fullView 0.5s forwards linear;
      }

      @keyframes fullView {
        100% {
          width: 100%;
        }
      }

      .animate {
        animation: shimmer 2s infinite;
        background: linear-gradient(
          to right,
          #eff1f3 4%,
          #e2e2e2 25%,
          #eff1f3 36%
        );
        background-size: 1000px 100%;
      }

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
    `,
  ],
})
export class PulsingSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
