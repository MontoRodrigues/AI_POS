import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCategory } from './pos-category';

describe('PosCategory', () => {
  let component: PosCategory;
  let fixture: ComponentFixture<PosCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
