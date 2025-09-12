import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageCaptureDialogue, ImageCapturerDialogResult } from '../image-capture-dialogue/image-capture-dialogue';
import { filter } from 'rxjs';
import { CropperDialogResult, CropperDialogue } from '../cropper-dialogue/cropper-dialogue';

export type image_upload_result = {
  blob: Blob;
  imageUrl: string;
};

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {

  @ViewChild('image_upload_btn') image_upload_div!: ElementRef;
  @ViewChild('image_upload') image_upload_input!: ElementRef;


  imageWidth = input<string>();
  imageHeight = input<string>();
  dialog = inject(MatDialog);

  imageReady = output<image_upload_result>();

  ngOnInit() {
    console.log("image_upload", this.imageHeight(), this.imageWidth());
  }

  getFile(){
    this.image_upload_input.nativeElement.click();
    this.image_upload_div.nativeElement.classList.remove('open');
  }

  OpenCropImage(file: any) {
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
        console.log("final", result);
        this.imageReady.emit(result);
        // this.croppedImageURL.set(result.imageUrl);
      });
  }

  openCamera() {
    this.image_upload_div.nativeElement.classList.remove('open');
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
        const file = new File([result.blob], "example.txt", { type: result.blob.type });
        this.OpenCropImage(file);
        //this.openFireResize(result.blob)
      });
  }

  fileSelected(event: any) {
    const file = event.target?.files[0];
    if (file) {
      console.log(file);
      this.OpenCropImage(file);
    }
  }


}
