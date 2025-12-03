// Extend the globalThis interface to include BarcodeDetector
declare global {
  interface BarcodeDetector {
    new (options?: { formats: string[] }): BarcodeDetector;
    detect(video: HTMLVideoElement): Promise<DetectedBarcode[]>;
  }

  interface globalThis {
    BarcodeDetector?: BarcodeDetector;
  }
}

export {};