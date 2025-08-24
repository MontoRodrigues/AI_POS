import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCapture } from './image-capture';

describe('ImageCapture', () => {
  let component: ImageCapture;
  let fixture: ComponentFixture<ImageCapture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCapture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCapture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
