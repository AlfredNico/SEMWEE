import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  template: `
    <p>
      catalog works!
    </p>
  `,
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  formLicencesPlans = this.fb.group({
    domain_project: ['', [Validators.required, Validators.max(4)]],
    user_id: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
