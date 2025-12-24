import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosUPIQrCode } from './pos-upi-qr-code';

describe('PosUPIQrCode', () => {
  let component: PosUPIQrCode;
  let fixture: ComponentFixture<PosUPIQrCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosUPIQrCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosUPIQrCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
