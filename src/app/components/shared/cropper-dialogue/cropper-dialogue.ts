import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

export type CropperDialogData = {
  image: File;
  width: number;
  height: number;
};

export type CropperDialogResult = {
  blob: Blob;
  imageUrl: string;
};

@Component({
  selector: 'app-cropper-dialogue',
  imports: [ImageCropperComponent, MatDialogModule],
  templateUrl: './cropper-dialogue.html',
  styleUrl: './cropper-dialogue.css'
})
export class CropperDialogue {

  data: CropperDialogData = inject(MAT_DIALOG_DATA);

  result = signal<CropperDialogResult | undefined>(undefined);

  imageCropped(event: ImageCroppedEvent) {
    const { blob, objectUrl } = event;
    if (blob && objectUrl) {
      this.result.set({ blob, imageUrl: objectUrl });
    }
  }
}
