import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAddTags } from './text-add-tags';

describe('TextAddTags', () => {
  let component: TextAddTags;
  let fixture: ComponentFixture<TextAddTags>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAddTags]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAddTags);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
