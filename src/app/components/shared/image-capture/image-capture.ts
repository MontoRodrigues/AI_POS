import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ImageCaptureDialogue, ImageCapturerDialogResult } from '../image-capture-dialogue/image-capture-dialogue';
import { CropperDialogue, CropperDialogResult } from '../cropper-dialogue/cropper-dialogue';

@Component({
  selector: 'app-image-capture',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './image-capture.html',
  styleUrl: './image-capture.css'
})
export class ImageCapture {

  imageWidth = input<string>();
  imageHeight = input<string>();
  dialog = inject(MatDialog);

  imageReady = output<Blob>();


  croppedImageURL = signal<string | undefined>(undefined);

  placeholder = computed(
    // () => `https://placehold.co/${this.imageWidth()}X${this.imageHeight()}`
    () => `/images/upload_image.png`
  );

  resetState() {
    this.croppedImageURL.set(undefined);
  }

  imageSource = computed(() => {
    return this.croppedImageURL() ?? this.placeholder();
  });

  openCapture() {
    const dialogRef = this.dialog.open(ImageCaptureDialogue, {
      data: {
        width: this.imageWidth(),
        height: this.imageHeight(),
      },
      width: '100%',
      panelClass: 'custom-dialogue'
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe((result: ImageCapturerDialogResult) => {
        console.log("blob result");
        console.log(result);
        this.openFireResize(result.blob)
      });
  }

  openFireResize(blob: Blob) {
    {

      if (blob) {
        const file = new File([blob], "example.txt", { type: blob.type });

        const dialogRef = this.dialog.open(CropperDialogue, {
          data: {
            image: file,
            width: this.imageWidth(),
            height: this.imageHeight(),
          },
          width: '100%',
        });

        dialogRef
          .afterClosed()
          .pipe(filter((result) => !!result))
          .subscribe((result: CropperDialogResult) => {
            console.log("this is the final result")
            console.log(result);
             this.imageReady.emit(result.blob);
            this.croppedImageURL.set(result.imageUrl);
          });
      }
    }
  }

  fileSelected(event: any) {
    const file = event.target?.files[0];
    if (file) {

    }
  }
}
