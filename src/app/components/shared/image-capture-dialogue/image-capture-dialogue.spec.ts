import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCaptureDialogue } from './image-capture-dialogue';

describe('ImageCaptureDialogue', () => {
  let component: ImageCaptureDialogue;
  let fixture: ComponentFixture<ImageCaptureDialogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCaptureDialogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCaptureDialogue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
