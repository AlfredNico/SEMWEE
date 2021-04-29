import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationSheetButtomComponent } from './information-sheet-buttom.component';

describe('InformationSheetButtomComponent', () => {
  let component: InformationSheetButtomComponent;
  let fixture: ComponentFixture<InformationSheetButtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationSheetButtomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationSheetButtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
