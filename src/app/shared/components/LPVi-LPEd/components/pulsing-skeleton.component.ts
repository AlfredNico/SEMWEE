import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pulsing-skeleton',
  template: `
    <div class="br">
      <section>
        <div class="comment br animate header"></div>
        <div class="comment br animate"></div>
        <div class="comment br animate"></div>
      </section>

      <aside>
        <div class="comment br animate header"></div>
      </aside>
    </div>
  `,
  styles: [
    `
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
      /* .card {
        border: 2px solid #fff;
        box-shadow: 0px 0px 10px 0 #a9a9a9;
        padding: 30px 40px;
        width: 80%;
        margin: 50px auto;
      } */
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
