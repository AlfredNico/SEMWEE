import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { usersData } from '@app/mock.interceptor';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  hide = true;

  public registrationForm = this.fb.group({
    lastname: ['', [Validators.required]],
    firstname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
  });
  public acceptedTerme = false;
  public readonly stayOn = this.fb.control(false);


  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('form', this.registrationForm.value);
    console.log('form', this.acceptedTerme);
    usersData.push(this.registrationForm.value);
    this.router.navigateByUrl('/connexion');
  }

}
