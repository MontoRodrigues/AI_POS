import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosExternalScanner1 } from './pos-external-scanner1';

describe('PosExternalScanner1', () => {
  let component: PosExternalScanner1;
  let fixture: ComponentFixture<PosExternalScanner1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosExternalScanner1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosExternalScanner1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
