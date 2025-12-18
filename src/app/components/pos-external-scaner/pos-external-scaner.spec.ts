import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosExternalScaner } from './pos-external-scaner';

describe('PosExternalScaner', () => {
  let component: PosExternalScaner;
  let fixture: ComponentFixture<PosExternalScaner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosExternalScaner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosExternalScaner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
