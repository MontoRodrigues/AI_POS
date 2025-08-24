
import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { Html5Qrcode } from "html5-qrcode"

@Component({
  selector: 'app-barcode-scanner',
  imports: [MatDialogModule],
  templateUrl: './barcode-scanner.html',
  styleUrl: './barcode-scanner.css'
})
export class BarcodeScanner implements OnInit, OnDestroy {

  constructor(private cdRef: ChangeDetectorRef, public dialogRef: MatDialogRef<BarcodeScanner>) { }
  private scanner!: Html5Qrcode;

  ngOnDestroy(): void {
    if (this.scanner.isScanning) {
      this.scanner.stop().catch(err => console.error("Error stopping QR scanner:", err));
    }
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.scanner = new Html5Qrcode('qr-reader');
    this.startScanner();
  }




  async startScanner() {


    this.scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      (decodedText: any, decodedResult: any) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);

        // Stop the scanner after a successful scan
        if (this.scanner) {
          this.scanner.stop();
        }

        console.log(this.dialogRef);
        this.dialogRef.close(decodedText);
      },
      (error: any) => {
        // Handle scan failure
      }
    ).catch((err: { message: any; }) => {
      console.error("Failed to start scanning.", err);

    });
  }

}
