import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentification/services/auth.service';

@Component({
  selector: 'app-public-layout',
  template: `
    <mat-toolbar class="app-header px-4" [style.background]="'white'">
      <button mat-icon-button aria-label="icon-button with menu icon">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Accueil</span>
      <div class="spacer"></div>
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
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    console.log(this.auth.currentUserSubject.value);
  }

}
