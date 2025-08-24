import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAddAttr } from './text-add-attr';

describe('TextAddAttr', () => {
  let component: TextAddAttr;
  let fixture: ComponentFixture<TextAddAttr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAddAttr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAddAttr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
