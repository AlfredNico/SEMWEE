import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSortModule } from '@angular/material/sort';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';

import { MatTooltipModule } from '@angular/material/tooltip';

import { MatProgressBarModule } from '@angular/material/progress-bar';


import { MatListModule } from '@angular/material/list';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';



@NgModule({
  declarations: [],
  imports: [
    MatTabsModule
  ],
  exports: [
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    MatBadgeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    MatDialogModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatListModule,
    MatProgressSpinnerModule
  ]
})
export class LandingModule { }
