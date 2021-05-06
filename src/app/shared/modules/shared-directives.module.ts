import { NgModule } from '@angular/core';
import { StylePaginatorDirective } from '@app/user-spaces/dashbord/directives/style-paginator.directive';
import { CapitalizeFirstPipePipe } from '@app/user-spaces/dashbord/pipe/capitalize-first-pipe.pipe';
import { RemoveUnderscorePipe } from '@app/user-spaces/dashbord/pipe/remove-underscore.pipe';
import { TypeofPipe } from '@app/user-spaces/dashbord/pipe/typeof.pipe';

@NgModule({
  declarations: [
    CapitalizeFirstPipePipe,
    RemoveUnderscorePipe,
    TypeofPipe,
    StylePaginatorDirective,
  ],
  exports: [
    CapitalizeFirstPipePipe,
    RemoveUnderscorePipe,
    TypeofPipe,
    StylePaginatorDirective,
  ],
})
export class SharedDirectivesModule {}
