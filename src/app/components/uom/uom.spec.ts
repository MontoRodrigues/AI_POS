import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Uom } from './uom';

describe('Uom', () => {
  let component: Uom;
  let fixture: ComponentFixture<Uom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Uom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Uom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
