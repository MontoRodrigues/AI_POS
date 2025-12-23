import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleProducts } from './sample-products';

describe('SampleProducts', () => {
  let component: SampleProducts;
  let fixture: ComponentFixture<SampleProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
