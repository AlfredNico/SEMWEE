import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  template: 
  `
  <!--begin::Profile Overview-->
<div class="d-flex flex-row">
    <!--begin::Aside-->
    <div class="flex-row-auto offcanvas-mobile w-300px w-xl-350px" id="kt_profile_aside">
      <app-profile-card></app-profile-card>
    </div>
    <!--end::Aside-->
  
    <!--begin::Content-->
    <div class="flex-row-fluid ml-lg-8">
      <router-outlet></router-outlet>
    </div>
    <!--end::Content-->
  </div>
  <!--end::Profile Overview-->
  `,
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
