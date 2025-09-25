import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseToInventory } from './purchase-to-inventory';

describe('PurchaseToInventory', () => {
  let component: PurchaseToInventory;
  let fixture: ComponentFixture<PurchaseToInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseToInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseToInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
