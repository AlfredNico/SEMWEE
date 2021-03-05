import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { usersData } from '@app/mock.interceptor';
import { CustomValidationService } from '@app/shared/services/custom-validation.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  hide = true;
  submitted = false;

  // public registrationForm = this.fb.group({
  //   lastname: ['', [Validators.required]],
  //   firstname: ['', [Validators.required]],
  //   email: ['', [Validators.required, Validators.email]],
  //   password: ['', Validators.compose([Validators.required, this.custumValidator.patternValidator()])],
  //   confirm_password: ['', Validators.required],
  // }, {
  //   validator: this.custumValidator.MatchPassword('password', 'confirm_password')
  // });
  // public registrationForm = new FormGroup({
  //   'lastname': new FormControl('', [Validators.required]),
  //   'firstname': new FormControl('', [Validators.required]),
  //   'email': new FormControl('', [Validators.required]),
  //   'password': new FormControl('', [Validators.required]),
  //   'confirm_password': new FormControl('', [Validators.required]),
  // });

  registrationForm = this.fb.group({
    lastname: ['', [Validators.required]],
    firstname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.compose([Validators.required, this.custumValidator.patternValidator()])],
    confirm_password: ['', Validators.required],
  }, {
    validator: this.custumValidator.MatchPassword('password', 'confirm_password')
  })

  // public acceptedTerme = false;
  public readonly acceptedTerme = this.fb.control(false, [Validators.required]);


  constructor(private fb: FormBuilder, private router: Router, private custumValidator: CustomValidationService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;

    console.log('form', this.registrationForm.value);
    console.log('form', this.acceptedTerme);
    usersData.push(this.registrationForm.value);
    this.router.navigateByUrl('/connexion');
  }

}
