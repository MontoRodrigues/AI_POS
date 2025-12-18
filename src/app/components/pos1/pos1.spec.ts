import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pos1 } from './pos1';

describe('Pos1', () => {
  let component: Pos1;
  let fixture: ComponentFixture<Pos1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pos1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pos1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
