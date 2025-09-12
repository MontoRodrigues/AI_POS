import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { CropperDialogue, CropperDialogResult } from '../../cropper-dialogue/cropper-dialogue';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';

@Component({
  selector: 'app-image-control',
  imports: [CommonModule],
  templateUrl: './image-control.html',
  styleUrl: './image-control.css'
})
export class ImageControl {


  @ViewChild('image_upload') image_upload_obj!: ElementRef;

  imageWidth = input<string>();
  imageHeight = input<string>();
  dialog = inject(MatDialog);


  croppedImageURL = signal<string | undefined>(undefined);

  imageReady = output<Blob>();


  placeholder = computed(
    // () => `https://placehold.co/${this.imageWidth()}X${this.imageHeight()}`
    () => `/images/upload_image.png`
  );

  imageSource = computed(() => {
    return this.croppedImageURL() ?? this.placeholder();
  });

  resetState() {
    this.image_upload_obj.nativeElement.value = '';
    this.croppedImageURL.set(undefined);
  }


  fileSelected(event: any) {
    const file = event.target?.files[0];
    if (file) {
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
          console.log(result);
          this.imageReady.emit(result.blob);
          this.croppedImageURL.set(result.imageUrl);
        });
    }
  }


}
