import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatListModule } from '@angular/material/list';

import { MatDividerModule } from '@angular/material/divider';

import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [],
  imports: [
    MatIconModule,
  ],
  exports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule,
  ]
})
export class LandingPageModule { }
