import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  template: `
    <div fxLayout="column">
        <h3 mat-dialog-title>Details project</h3>
        <div mat-dialog-content>
            
        </div>
        <div mat-dialog-actions align='center'>
            <button mat-raised-button tabindex="-1" mat-dialog-close>Close</button>
        </div>
    </div>
  `,
  styleUrls: []
})
export class DetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
