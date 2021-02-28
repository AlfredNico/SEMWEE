import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentification/services/auth.service';

@Component({
  selector: 'app-home-page',
  template: `
    <!-- Toolbar -->
    <mat-toolbar class="app-header px-4" [style.background]="'white'">
      <button mat-icon-button aria-label="icon-button with menu icon">
        <mat-icon>menu</mat-icon>
      </button>
      <span>SEMWEE</span>
      <div class="spacer"></div>
      <!--<button mat-stroked-button [routerLink]="['/connexion']" class="mx-3">Connecter</button>
      <button mat-stroked-button (click)="auth.logout()" class="mx-3">Déconnecter</button> -->
      <ng-template #loginTemplete>
         <button mat-stroked-button [routerLink]="['/connexion']" class="mx-3">Connecter</button>
      </ng-template>
      <ng-template #logoutTemplete>
          <button mat-stroked-button (click)="auth.logout()" class="mx-3">Déconnecter</button>
      </ng-template>

      <ng-container *ngTemplateOutlet="!auth.currentUserSubject?.value ? loginTemplete : logoutTemplete">
      </ng-container>
    </mat-toolbar>
  `,
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  totalEstimate = 10;
  ctx = {estimate: this.totalEstimate};

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

}
