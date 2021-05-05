import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedDirectivesModule } from '@app/shared/modules/shared-directives.module';
import { LpEditorComponent } from './lp-editor.component';

@NgModule({
  declarations: [LpEditorComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    RouterModule.forChild([{ path: '', component: LpEditorComponent }]),
  ],
  exports: [RouterModule],
})
export class LpEditorModule {}
