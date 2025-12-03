import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeMultipleSelect } from './barcode-multiple-select';

describe('BarcodeMultipleSelect', () => {
  let component: BarcodeMultipleSelect;
  let fixture: ComponentFixture<BarcodeMultipleSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeMultipleSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeMultipleSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
