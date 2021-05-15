import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LandingPageModule } from './landing-page.module';
import { SharedDirectivesModule } from './shared-directives.module';
import { SharedModule } from './shared.module';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    CommonModule
  ],
  exports: [
    CommonModule,
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedComponentsModule { }