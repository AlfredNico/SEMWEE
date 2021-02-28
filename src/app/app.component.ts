import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.
    <div style="text-align:center" class="content">
      <h1>
        Welcome to {{title}}!
      </h1>

      <span>SEMWEE app is running!</span>
    </div> -->

    <router-outlet></router-outlet>
  `,
  styles: [`
    ::ng-deep.spacer {
      flex: 1 1 auto;
    }
`]
})
export class AppComponent {
  title = 'SEMWEE';
}
