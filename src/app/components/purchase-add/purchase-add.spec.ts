import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAdd } from './purchase-add';

describe('PurchaseAdd', () => {
  let component: PurchaseAdd;
  let fixture: ComponentFixture<PurchaseAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
