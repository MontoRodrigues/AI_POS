import { afterNextRender, ChangeDetectorRef, Component, ElementRef, Inject, inject, OnDestroy, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';



import "barcode-detector/ponyfill";
import { BarcodeDetector } from 'barcode-detector/ponyfill';



@Component({
  selector: 'app-barcode-scanner-native',
    imports: [MatDialogModule],
  templateUrl: './barcode-scanner-native.html',
  styleUrl: './barcode-scanner-native.css'
})
export class BarcodeScannerNative {


@ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
@ViewChild('overlay') overlay!: ElementRef<HTMLCanvasElement>;

  barcodeDetector: BarcodeDetector | null = null;
  // barcodeResult: string | null = null;
  // errorMessage: string | null = null;
  mediaStream: MediaStream | null = null;
  facingMode = "environment";

  constructor(private cdRef: ChangeDetectorRef, public dialogRef: MatDialogRef<BarcodeScannerNative>) { }

  async ngAfterViewInit() {
    if ('BarcodeDetector' in globalThis) {
      this.barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'code_128'] }); // Specify desired formats
    } else {
     // this.errorMessage = 'Barcode Detector is not supported in this browser, using polyfill.';
      // The polyfill should have already registered BarcodeDetector, so we can still instantiate it.
      this.barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'code_128'] });
    }

    this.overlay.nativeElement.width = this.overlay.nativeElement.offsetWidth;
    this.overlay.nativeElement.height = this.overlay.nativeElement.offsetHeight;

    this.cdRef.detectChanges();
    await this.startScanning();
  }

  async flipCamera(){
    this.facingMode = this.facingMode === "environment" ? "user" : "environment";
    this.startScanning();
  }

  closeScanner(){
    this.stopScanning();
    this.dialogRef.close();
  }

  async startScanning(): Promise<void> {
    try {
      if (this.mediaStream) this.mediaStream.getTracks().forEach(t => t.stop());

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: this.facingMode } });
      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.videoElement.nativeElement.play();
      this.scanForBarcodes();
    } catch (err) {
     // this.errorMessage = `Error accessing camera: ${err}`;
      console.error('Error accessing camera:', err);
    }
  }

  private async scanForBarcodes(): Promise<void> {
    if (!this.barcodeDetector || !this.videoElement.nativeElement || !this.mediaStream) {
      return;
    }

    const detectAndRepeat = async () => {
      try {
        // console.log("Start Detecting", this.barcodeDetector);
        const barcodes = await this.barcodeDetector!.detect(this.videoElement.nativeElement);
        // console.log("Detection complete", barcodes);
        if (barcodes.length > 0) {
          //this.barcodeResult = barcodes[0].rawValue;
          //console.log('Detected barcode:', this.barcodeResult);
          // Stop scanning after first detection
          //this.drawDetections(barcodes);
          //barcodes.push(...barcodes); // this is for testing multiple detections
          this.stopScanning();
          this.dialogRef.close(barcodes);
          
        }
      } catch (err) {
        //this.errorMessage = `Error detecting barcode: ${err}`;
        console.error('Error detecting barcode:', err);
      } finally {
        if (this.mediaStream) { // Only continue if scanning is active
          requestAnimationFrame(detectAndRepeat);
        }
      }
    };
    requestAnimationFrame(detectAndRepeat);
  }

  // drawDetections(barcodes:any[]): void {
  //   console.log("Drawing detections", barcodes);
  //   let ctx = this.overlay.nativeElement.getContext("2d", { willReadFrequently: true });
  //   console.log(this.overlay.nativeElement.offsetWidth, this.overlay.nativeElement.offsetHeight)
  //   console.log(this.overlay.nativeElement.width, this.overlay.nativeElement.height)
  //   if (ctx) {
  //     ctx.clearRect(0, 0, this.overlay.nativeElement.offsetWidth, this.overlay.nativeElement.offsetHeight);
  //     ctx.fillStyle = "red";
  //     ctx.fillRect(this.overlay.nativeElement.width/2, 0, this.overlay.nativeElement.width/2, this.overlay.nativeElement.height);

  //     for (const b of barcodes) {
  //       // Bounding box
  //       if (b.boundingBox) {
  //         console.log("Drawing bounding box");
  //         const { x, y, width, height } = b.boundingBox;
  //         console.log(x, y, width, height);
  //         ctx.lineWidth = 3;
  //         ctx.strokeStyle = "#00e0b8";
  //         ctx.strokeRect(x, y, width, height);

  //         // Label
  //         const label = b.format ? `${b.format}` : "code";
  //         ctx.fillStyle = "rgba(0,0,0,0.6)";
  //         const text = `${label}`;
  //         ctx.font = "16px ui-monospace, monospace";
  //         const tw = ctx.measureText(text).width;
  //         ctx.fillRect(x, y - 22, tw + 10, 20);
  //         ctx.fillStyle = "#fff";
  //         ctx.fillText(text, x + 5, y - 7);
  //       }

  //       // Corner points (if provided)
  //       if (b.cornerPoints && b.cornerPoints.length) {
  //         ctx.beginPath();
  //         ctx.lineWidth = 2;
  //         ctx.strokeStyle = "#8ab4ff";
  //         ctx.moveTo(b.cornerPoints[0].x, b.cornerPoints[0].y);
  //         for (let i = 1; i < b.cornerPoints.length; i++) {
  //           ctx.lineTo(b.cornerPoints[i].x, b.cornerPoints[i].y);
  //         }
  //         ctx.closePath();
  //         ctx.stroke();
  //       }
  //     }
  //   }
  //   }


  stopScanning(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
      this.videoElement.nativeElement.srcObject = null;
    }
  }
}
