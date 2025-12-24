

export interface iBarcodeScanned {
  code: string;
  timestamp: Date;
  format: string;
}

export interface iDeviceScanner {
  connectionCode: string;
  status: 'WAITING' | 'CONNECTED';
  last_heartbeat: Date | null;
  current_scan: iBarcodeScanned | null;
}

export interface iQrCode {
  URL: string;
  Amount: number;
  timestamp: Date;
}
export interface iUPIQrCode {
  connectionCode: string;
  status: 'WAITING' | 'CONNECTED';
  last_heartbeat: Date | null;
  UPIQrCode: iQrCode | null;
}

// use the firebase set Doc and add the machine id as doc id
export interface iDeviceAdd {
  scanner: iDeviceScanner;
  UPIScreen: iUPIQrCode;
}

export interface iDevice extends iDeviceAdd {
  docId: string;
}

