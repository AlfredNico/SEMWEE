import { IsURLPipe } from './../../user-spaces/dashbord/pipe/is-url.pipe';
import { NgModule } from '@angular/core';
import { StylePaginatorDirective } from '@app/user-spaces/dashbord/directives/style-paginator.directive';
import { CapitalizeFirstPipePipe } from '@app/user-spaces/dashbord/pipe/capitalize-first-pipe.pipe';
import { RemoveUnderscorePipe } from '@app/user-spaces/dashbord/pipe/remove-underscore.pipe';
import { TypeofPipe } from '@app/user-spaces/dashbord/pipe/typeof.pipe';
import { ChabgeColumnNamePipe } from '@app/user-spaces/dashbord/pipe/chabge-column-name.pipe';

@NgModule({
  declarations: [
    IsURLPipe,
    ChabgeColumnNamePipe,
    CapitalizeFirstPipePipe,
    RemoveUnderscorePipe,
    TypeofPipe,
    StylePaginatorDirective,
  ],
  exports: [
    IsURLPipe,
    ChabgeColumnNamePipe,
    CapitalizeFirstPipePipe,
    RemoveUnderscorePipe,
    TypeofPipe,
    StylePaginatorDirective,
  ],
})
export class SharedDirectivesModule {}
