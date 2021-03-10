import { NgModule } from '@angular/core';
// import { DashbordComponent } from './dashbord/dashbord.component';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { LandingModule } from '@app/shared/modules/landing.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '@app/shared/components/side-menu/side-menu.component';
import { SettingTableComponent } from '../shared/components/setting-table/setting-table.component';
import { ConvertUploadFileService } from './dashbord/services/convert-upload-file.service';
import { LpValidatorComponent } from './dashbord/components/lp-validator/lp-validator.component';
import { ImportItemComponent } from './dashbord/components/lp-validator/import-item.component';
import { CheckRelevancyComponent } from './dashbord/components/lp-validator/check-relevancy.component';
import { InferListComponent } from './dashbord/components/lp-validator/infer-list.component';
import { LpValidatorService } from './dashbord/services/lp-validator.service';
import { LayoutComponent } from '../pages/_layout/layout.component';
import { SubheaderWrapperComponent } from '@app/_metronic/partials/layout/subheader/subheader-wrapper/subheader-wrapper.component';
import { SearchOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/search-offcanvas/search-offcanvas.component';
import { NotificationsOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/notifications-offcanvas/notifications-offcanvas.component';
import { QuickActionsOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/quick-actions-offcanvas/quick-actions-offcanvas.component';
import { CartOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/cart-offcanvas/cart-offcanvas.component';
import { QuickPanelOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/quick-panel-offcanvas/quick-panel-offcanvas.component';
import { UserOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/user-offcanvas/user-offcanvas.component';
import { ToolbarComponent } from '@app/_metronic/partials/layout/extras/toolbar/toolbar.component';
import { ScrollTopComponent } from '@app/_metronic/partials/layout/extras/scroll-top/scroll-top.component';
import { ScriptsInitComponent } from '@app/pages/_layout/init/scipts-init/scripts-init.component';
import { Subheader7Component } from '@app/_metronic/partials/layout/subheader/subheader7/subheader7.component';
import { Subheader6Component } from '@app/_metronic/partials/layout/subheader/subheader6/subheader6.component';
import { Subheader5Component } from '@app/_metronic/partials/layout/subheader/subheader5/subheader5.component';
import { Subheader4Component } from '@app/_metronic/partials/layout/subheader/subheader4/subheader4.component';
import { Subheader3Component } from '@app/_metronic/partials/layout/subheader/subheader3/subheader3.component';
import { Subheader2Component } from '@app/_metronic/partials/layout/subheader/subheader2/subheader2.component';
import { Subheader1Component } from '@app/_metronic/partials/layout/subheader/subheader1/subheader1.component';


@NgModule({
  declarations: [
    // DashbordComponent,
    LayoutComponent,
    SideMenuComponent,
    LpValidatorComponent,
    ImportItemComponent,
    CheckRelevancyComponent,
    InferListComponent,
    SettingTableComponent,
    SubheaderWrapperComponent, //...
    SearchOffcanvasComponent,
    NotificationsOffcanvasComponent,
    QuickActionsOffcanvasComponent,
    CartOffcanvasComponent,
    QuickPanelOffcanvasComponent,
    UserOffcanvasComponent,
    ToolbarComponent,
    ScrollTopComponent,
    ScriptsInitComponent,
    Subheader1Component,
    Subheader2Component,
    Subheader3Component,
    Subheader4Component,
    Subheader5Component,
    Subheader6Component,
    Subheader7Component,
  ],
  imports: [
    LandingPageModule,
    LandingModule,
    SharedModule,
    MatStepperModule, // stepper module
    RouterModule.forChild([
      {
        path: '', component: LayoutComponent, children: [
          { path: 'lp-validator', component: LpValidatorComponent },
          { path: '', redirectTo: 'lp-validator', pathMatch: 'full' }
        ]
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [
    LpValidatorService,
    ConvertUploadFileService
  ],
  entryComponents: [
    SettingTableComponent,
    ImportItemComponent,
    CheckRelevancyComponent,
    InferListComponent
  ]

})
export class DashbordModule { }
