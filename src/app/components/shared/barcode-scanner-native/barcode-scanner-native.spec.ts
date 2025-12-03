import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeScannerNative } from './barcode-scanner-native';

describe('BarcodeScannerNative', () => {
  let component: BarcodeScannerNative;
  let fixture: ComponentFixture<BarcodeScannerNative>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeScannerNative]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeScannerNative);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
