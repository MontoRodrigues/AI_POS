import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var ImageCapture: any;

export type ImageCapturerDialogData = {
  width: number;
  height: number;
};

export type ImageCapturerDialogResult = {
  blob: Blob;
};

@Component({
  selector: 'app-image-capture-dialogue',
  imports: [MatDialogModule, FormsModule],
  templateUrl: './image-capture-dialogue.html',
  styleUrl: './image-capture-dialogue.css'
})
export class ImageCaptureDialogue implements OnInit, OnDestroy {
  @ViewChild('videoEl', { static: true }) videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('cropCanvas', { static: true }) cropCanvas!: ElementRef<HTMLCanvasElement>;

  video_id:string="monto";

  data: ImageCapturerDialogData = inject(MAT_DIALOG_DATA);
  // result = signal<ImageCapturerDialogResult | undefined>(undefined);

  mimeType = 'image/png';
  stream: MediaStream | null = null;
  imageCapture: any | null = null;
  devices: any[] = [];
  activeDevice: string | undefined = undefined;

  constructor(private cdRef: ChangeDetectorRef, public dialogRef: MatDialogRef<ImageCaptureDialogue>) { }


  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
    this.stop();
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    // get the media stream 
    console.log("ID")
    console.log(document.getElementById(this.video_id));
    this.init();
  }

  private async init() {

    this.stop();
    // get stream

    // constrains
    let constraints: any = {};


    if (this.activeDevice != undefined)
      constraints = { video: { deviceId: { exact: this.activeDevice } }, audio: false };
    else
      constraints = { video: { facingMode: "environment" }, audio: false };

    console.log("constrains")
    console.log(constraints)

    let stream: any = undefined;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    }
    catch (e) {

    }

    console.log("Stream")
    console.log(stream)

    if (stream != undefined) {

      const track = stream.getVideoTracks()[0];
      this.imageCapture = new ImageCapture(track);
      this.activeDevice = track.getSettings().deviceId;
      console.log("current device");
      console.log(this.activeDevice)

      this.stream = stream;

      this.videoEl.nativeElement.srcObject = stream;

      //get devices
      let devices = await navigator.mediaDevices.enumerateDevices();
      if (devices) {
        devices = devices.filter(d => d.kind == "videoinput")
        this.devices = devices;
      }
      //this.activeDevice =devices;
      this.cdRef.detectChanges();
      console.log("Getting Constrains");
      console.log(devices);
      console.log(navigator.mediaDevices.getSupportedConstraints());
    }
    else{
      alert("Please enable Camera Access");
    }

  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.imageCapture = null;
      this.stream = null;
    }
  }

  async capture() {
    const cropCanvas = this.cropCanvas.nativeElement;

    console.log("capture");
    const img = await this.imageCapture.grabFrame();
    console.log(img)

    cropCanvas.width = img.width;
    cropCanvas.height = img.height;

    cropCanvas.getContext('2d')?.clearRect(0, 0, img.width, img.width);
    cropCanvas.getContext('2d')?.drawImage(img, 0, 0);


    const blob: Blob = await new Promise((resolve) => {
      cropCanvas.toBlob((b) => resolve(b as Blob), this.mimeType);
    });

    this.dialogRef.close({ "blob": blob });

  }

  imageCropped() {
    // this.result.set({ "blob": null, imageUrl: null });
    this.dialogRef.close({ "blob": null, imageUrl: null });
  }

  ChangeCamera() {
    console.log("lets chnge the camera");
    this.init();
  }
}
