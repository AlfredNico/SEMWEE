import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'connexion', component: SignInComponent }
    ])
  ]
})
export class AuthModule { }
