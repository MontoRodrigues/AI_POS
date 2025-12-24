import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosExternalScanner } from './pos-external-scanner';

describe('PosExternalScanner', () => {
  let component: PosExternalScanner;
  let fixture: ComponentFixture<PosExternalScanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosExternalScanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosExternalScanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
