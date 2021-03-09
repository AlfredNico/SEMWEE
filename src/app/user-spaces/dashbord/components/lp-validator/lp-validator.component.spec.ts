import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpValidatorComponent } from './lp-validator.component';

describe('LpValidatorComponent', () => {
  let component: LpValidatorComponent;
  let fixture: ComponentFixture<LpValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpValidatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
