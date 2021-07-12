import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pulsing-skeleton',
  template: `
    <!-- <div class="br">
      <section>
        <div class="comment br animate header"></div>
        <div class="comment br animate"></div>
        <div class="comment br animate"></div>
      </section>

      <aside>
        <div class="comment br animate header"></div>
      </aside>
    </div> -->
    <table class="w-100 table-viewer">
      <tr>
        <th>
          <img
            src="assets/images/gif/skeleton.gif"
            width="70"
            height="30"
            class="mx-10"
          />
        </th>
        <th>
          <img
            src="assets/images/gif/skeleton.gif"
            width="70"
            height="30"
            class="mx-10"
          />
        </th>
        <th>
          <img
            src="assets/images/gif/skeleton.gif"
            width="70"
            height="30"
            class="mx-10"
          />
        </th>
        <th>
          <img
            src="assets/images/gif/skeleton.gif"
            width="70"
            height="30"
            class="mx-10"
          />
        </th>
        <th>
          <img
            src="assets/images/gif/skeleton.gif"
            width="70"
            height="30"
            class="mx-10"
          />
        </th>
        <th>
          <img
            src="assets/images/gif/skeleton.gif"
            width="70"
            height="30"
            class="mx-10"
          />
        </th>
      </tr>
      <tr>
        <td>
          <img
            src="assets/images/gif/skeleton.gif"
            width="40"
            height="30"
            class="mx-10"
          />
          <img
            src="assets/images/gif/skeleton.gif"
            width="40"
            height="30"
            class="mx-10"
          />
          <img
            src="assets/images/gif/skeleton.gif"
            width="40"
            height="30"
            class="mx-10"
          />
        </td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
      </tr>
      <tr>
        <td>
          <img
            src="assets/images/gif/skeleton.gif"
            width="40"
            height="30"
            class="mx-10"
          />
          <img
            src="assets/images/gif/skeleton.gif"
            width="40"
            height="30"
            class="mx-10"
          />
          <img
            src="assets/images/gif/skeleton.gif"
            width="40"
            height="30"
            class="mx-10"
          />
        </td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
        <td class="nody"><div class="header-content br animate"></div></td>
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
