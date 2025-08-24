import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperDialogue } from './cropper-dialogue';

describe('CropperDialogue', () => {
  let component: CropperDialogue;
  let fixture: ComponentFixture<CropperDialogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropperDialogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropperDialogue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
