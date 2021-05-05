import { NgModule } from '@angular/core';
import { CapitalizeFirstPipePipe } from '@app/user-spaces/dashbord/pipe/capitalize-first-pipe.pipe';
import { RemoveUnderscorePipe } from '@app/user-spaces/dashbord/pipe/remove-underscore.pipe';

@NgModule({
  declarations: [CapitalizeFirstPipePipe, RemoveUnderscorePipe],
  exports: [CapitalizeFirstPipePipe, RemoveUnderscorePipe],
})
export class SharedDirectivesModule {}
