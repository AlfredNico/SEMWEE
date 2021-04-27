import { LandingPageModule } from './shared/modules/landing-page.module';
import { BottonSheetComponent } from './shared/components/botton-sheet/botton-sheet.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from './shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { tokenInterceptor } from './token.interceptor';
import { mockInterceptor } from './mock.interceptor';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ResetPasswordGuard } from './guards/reset-password.guard';
import { interruptedInterceptor } from './interrupted.interceptor';
import { InformationSheetButtomComponent } from './shared/components/information-sheet-buttom/information-sheet-buttom.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
  // return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BottonSheetComponent,
    InformationSheetButtomComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    InlineSVGModule.forRoot(),
    HttpClientModule,
    LandingPageModule,
    SharedModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forRoot([
      {
        path: 'home',
        loadChildren: () =>
          import('./public-sapces/public-spaces.module').then(
            (m) => m.PublicSpacesModule
          ),
        canActivate: [IsLoggedInGuard],
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import('./authentification/components/sign-in/auth.module').then(
            (m) => m.AuthModule
          ),
      },
      {
        path: 'sign-up',
        loadChildren: () =>
          import('./authentification/components/sign-up/sign-up.module').then(
            (m) => m.SignUpModule
          ),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import(
            './authentification/components/forget-password/forget-password.module'
          ).then((m) => m.ForgetPasswordModule),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import(
            './authentification/components/resetpassword/resetpassword.module'
          ).then((m) => m.ResetpasswordModule),
        canActivate: [ResetPasswordGuard],
      },
      {
        path: '',
        loadChildren: () =>
          import('./user-spaces/dashbord.module').then((m) => m.DashbordModule),
        canActivate: [AuthGuard, IsLoggedInGuard],
      },
      // { path: '**', component: PageNotFoundComponent },
      // { path: '', pathMatch: 'full', redirectTo: 'home' },
    ]),
  ],
  exports: [RouterModule],
  providers: [
    CookieService,
    tokenInterceptor,
    errorInterceptor,
    mockInterceptor,
    interruptedInterceptor,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
