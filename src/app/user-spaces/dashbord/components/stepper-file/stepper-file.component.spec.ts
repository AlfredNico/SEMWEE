import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFileComponent } from './stepper-file.component';

describe('StepperFileComponent', () => {
  let component: StepperFileComponent;
  let fixture: ComponentFixture<StepperFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
