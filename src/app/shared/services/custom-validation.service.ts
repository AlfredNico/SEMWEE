import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {
  constructor() {}

  public patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null as any;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : ({ invalidPassword: true } as any);
    };
  }

  public MatchPassword(
    password: string,
    confirmPassword: string
  ): { [key: string]: any } {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        return confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        return confirmPasswordControl.setErrors(null);
      }
    };
  }

  uppercaseValidator(c: FormControl) {
    const regex = /[A-Z]/g;
    if (!regex.test(c.value) && c.value) return { uppercase: true };
    else return null;
  }

  domainValidation(c: FormControl) {
    const regex = /^((ftp|http|https):\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/;
    if (!regex.test(c.value) && c.value) return { domain: true };
    else return null;
  }

  maxLength(c: FormControl) {
    if (c.value.length > 40) return { maxLength: true };
    else return null;
  }
}
