import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextDropdown } from './text-dropdown';

describe('TextDropdown', () => {
  let component: TextDropdown;
  let fixture: ComponentFixture<TextDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
