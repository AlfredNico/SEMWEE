import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from './shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { TokenInterceptor } from './token.interceptor';
import { MockInterceptor } from './mock.interceptor';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,
    SharedModule,
    RouterModule.forRoot([
      {
        path: 'accueil',
        loadChildren: () => import('./public-sapces/public-spaces.module').then(m => m.PublicSpacesModule),
        canActivate: [IsLoggedInGuard]
      },
      {
        path: 'espace-user',
        loadChildren: () => import('./user-spaces/user-space.module').then(m => m.UserSpaceModule),
        canActivate: [AuthGuard, IsLoggedInGuard]
      },
      {
        path: 'connexion',
        loadChildren: () => import('./authentification/components/sign-in/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'inscription',
        loadChildren: () => import('./authentification/components/sign-up/sign-up.module').then(m => m.SignUpModule)
      },
      {
        path: 'mot-passe-oublie',
        loadChildren: () => import('./authentification/components/forget-password/forget-password.module').then(m => m.ForgetPasswordModule)
      },
      { path: '', pathMatch: 'full', redirectTo: 'accueil' },
      { path: '**', component: PageNotFoundComponent },
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
