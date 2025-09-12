import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchBtn } from './switch-btn';

describe('SwitchBtn', () => {
  let component: SwitchBtn;
  let fixture: ComponentFixture<SwitchBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
