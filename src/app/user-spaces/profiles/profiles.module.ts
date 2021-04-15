import { ProfilesService } from './services/profiles.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './components/user/user.component';
import { SharedModule } from '@app/shared/modules/shared.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { LandingModule } from '@app/shared/modules/landing.module';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
// import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
// import {WidgetsModule} from '../../_metronic/partials/content/widgets/widgets.module';
// import {DropdownMenusModule} from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';

import { AccountInformationComponent } from './components/user/account-information/account-information.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { EmailSettingsComponent } from './components/user/email-settings/email-settings.component';
import { PersonalInformationComponent } from './components/user/personal-information/personal-information.component';
import { ProfileOverviewComponent } from './components/user/profile-overview/profile-overview.component';
import { SavedCreditCardsComponent } from './components/user/saved-credit-cards/saved-credit-cards.component';
import { StatementsComponent } from './components/user/statements/statements.component';
import { TaxInformationComponent } from './components/user/tax-information/tax-information.component';
import { ProfileCardComponent } from './components/user/_components/profile-card/profile-card.component';

@NgModule({
  declarations: [
    UserComponent,
    ProfileOverviewComponent,
    PersonalInformationComponent,
    AccountInformationComponent,
    ChangePasswordComponent,
    EmailSettingsComponent,
    SavedCreditCardsComponent,
    TaxInformationComponent,
    StatementsComponent,
    ProfileCardComponent,
  ],
  imports: [
    SharedModule,
    LandingPageModule,
    LandingModule,
    CommonModule,
    HttpClientModule,
    CRUDTableModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    // DropdownMenusModule,
    NgbDropdownModule,
    NgbTooltipModule,
    // WidgetsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserComponent,
        children: [
          {
            path: 'profile-overview',
            component: ProfileOverviewComponent,
          },
          {
            path: 'personal-information',
            component: PersonalInformationComponent,
          },
          {
            path: 'account-information',
            component: AccountInformationComponent,
          },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
          },
          {
            path: 'email-settings',
            component: EmailSettingsComponent,
          },
          {
            path: 'saved-credic-cards',
            component: SavedCreditCardsComponent,
          },
          {
            path: 'tax-information',
            component: TaxInformationComponent,
          },
          {
            path: 'statements',
            component: StatementsComponent,
          },
          { path: '', redirectTo: 'personal-information', pathMatch: 'full' },
          { path: '**', redirectTo: 'personal-information', pathMatch: 'full' },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [ProfilesService],
})
export class ProfilesModule {}
