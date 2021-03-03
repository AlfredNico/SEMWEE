
import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  firstName = new FormControl('');
  triggers = new FormGroup({
    filters: new FormControl(''),
  });
  
  constructor() { }

  ngOnInit() {
    this.triggers.valueChanges.subscribe(filter => {
      console.log(filter);
    })

    console.log(this.triggers.controls);
    
  }

  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];

  drop(event: CdkDragDrop<string[]>) {
    console.log(event.previousIndex, event.currentIndex);
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    console.log('timePeriods ', this.timePeriods);
  }
}
