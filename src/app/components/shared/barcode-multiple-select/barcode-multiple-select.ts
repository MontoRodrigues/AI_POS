import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-barcode-multiple-select',
  imports: [MatDialogModule],
  templateUrl: './barcode-multiple-select.html',
  styleUrl: './barcode-multiple-select.css'
})
export class BarcodeMultipleSelect {

   constructor(private cdRef: ChangeDetectorRef, public dialogRef: MatDialogRef<BarcodeMultipleSelect>, @Inject(MAT_DIALOG_DATA) public data:any) { }
}
