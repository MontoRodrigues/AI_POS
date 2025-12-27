import { Component, ElementRef, OnInit, OnDestroy, ViewChild, NgZone, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define types for the BarcodeDetector API since it might not be in standard TS lib yet
declare global {
  interface Window {
    BarcodeDetector: any;
    ImageCapture: any;
  }
}

declare var showLoader: Function;

@Component({
  selector: 'app-pos-external-scanner1',
  imports: [CommonModule],
  templateUrl: './pos-external-scanner1.html',
  styleUrl: './pos-external-scanner1.css'
})
export class PosExternalScanner1 implements OnInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  // Use inject() to avoid constructor DI metadata issues (NG0202)
  private ngZone = inject(NgZone);

  constructor(private cdRef: ChangeDetectorRef){

  }

  // UI State
  status = 'Detector: initializing…';
  supportedFormatsText = '—';
  logText = 'Results will appear here…';
  torchDisabled = true;

  // Internal Logic
  private detector: any;
  private stream: MediaStream | null = null;
  private videoTrack: MediaStreamTrack | null = null;
  private imageCapture: any | null = null; // ImageCapture API
  private scanning = false;
  private facingMode: 'environment' | 'user' = 'environment';
  private torchOn = false;
  private animationFrameId: number | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  // Throttling
  private lastTime = 0;
  private readonly MIN_DT = 80; // ms

  async ngOnInit() {
    showLoader(false);
    await this.initializeDetector();
    
    // Handle visibility change to save battery/resources
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  ngOnDestroy() {
    this.stopCamera();
    this.scanning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  // 1. Initialize Polyfill and Detector
  private async initializeDetector() {
    try {
      // Check for native support or load polyfill
      if (!('BarcodeDetector' in window)) {
         // Dynamic import for the polyfill
         const { BarcodeDetectorPolyfill } = await import('https://cdn.jsdelivr.net/npm/@undecaf/barcode-detector-polyfill@0.9.23/dist/main.js' as any);
         (window as any).BarcodeDetector = BarcodeDetectorPolyfill;
      } else {
        // Even if it exists, check if getSupportedFormats works (some implementations might be partial)
        try {
          await window.BarcodeDetector.getSupportedFormats();
        } catch {
          const { BarcodeDetectorPolyfill } = await import('https://cdn.jsdelivr.net/npm/@undecaf/barcode-detector-polyfill@0.9.23/dist/main.js' as any);
          (window as any).BarcodeDetector = BarcodeDetectorPolyfill;
        }
      }

      // Feature detect again after potential polyfill load
      if (!('BarcodeDetector' in window)) {
        this.status = 'Detector: not supported';
        this.logText = 'Your browser doesn’t support the BarcodeDetector API. Try Chrome/Edge/Android WebView.';
        return;
      }

      // Query formats
      let supportedFormats: string[] = [];
      try {
        supportedFormats = await window.BarcodeDetector.getSupportedFormats();
      } catch (e) {
        console.warn('Could not get formats', e);
      }
      this.supportedFormatsText = supportedFormats.join(', ') || 'unknown';

      // Create Detector
      this.detector = new window.BarcodeDetector({
        formats: supportedFormats.length
          ? supportedFormats
          : ["qr_code", "code_128", "ean_13", "ean_8", "upc_a", "upc_e", "itf", "codabar", "data_matrix", "pdf417", "aztec"]
      });

      this.status = 'Detector: ready';
      
      // Kick off camera
      await this.startCamera();
      this.startScanning();

    } catch (e: any) {
      this.status = 'Initialization Error';
      this.logText = 'Error initializing: ' + e.message;
    }
  }

  // 2. Camera Handling
  private async startCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          focusMode: "continuous", // Non-standard constraint, but works on some Androids
          zoom: true
        } as any, // Cast to any because TS might not know some constraints
        audio: false
      });

      const video = this.videoElement.nativeElement;
      video.srcObject = this.stream;
      await video.play();

      this.videoTrack = this.stream.getVideoTracks()[0];
      
      // Torch setup
      try {
        if ('ImageCapture' in window) {
           this.imageCapture = new window.ImageCapture(this.videoTrack);
        }
      } catch {
        this.imageCapture = null;
      }

      // Resize canvas to match video
      await new Promise(r => requestAnimationFrame(r));
      this.resizeCanvas();
      
      // Listen for window resize to adjust canvas
      window.addEventListener('resize', this.resizeCanvas.bind(this));
      
      this.updateTorchAvailability();

    } catch (e: any) {
      this.status = 'Camera error';
      this.logText = 'Unable to start camera: ' + e.message;
    }
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  async toggleCamera() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    await this.startCamera();
  }

  private updateTorchAvailability() {
    this.torchDisabled = true;
    if (!this.videoTrack) return;

    const caps = (this.videoTrack as any).getCapabilities?.();
    if (caps && 'torch' in caps && caps.torch) {
      this.torchDisabled = false;
    }
  }

  async toggleTorch() {
    if (!this.videoTrack || !this.videoTrack.applyConstraints) return;
    this.torchOn = !this.torchOn;
    try {
      await this.videoTrack.applyConstraints({ advanced: [{ torch: this.torchOn }] } as any);
    } catch (e) {
      console.warn("Torch toggle failed:", e);
      // Revert state if failed
      this.torchOn = !this.torchOn;
    }
  }

  // 3. Canvas & Drawing
  private resizeCanvas() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
  }

  private drawDetections(barcodes: any[]) {
    if (!this.ctx || !this.canvasElement) return;
    const ctx = this.ctx;
    const canvas = this.canvasElement.nativeElement;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const b of barcodes) {
      // Bounding box
      if (b.boundingBox) {
        const { x, y, width, height } = b.boundingBox;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#00e0b8";
        ctx.strokeRect(x, y, width, height);

        // Label
        const label = b.format ? `${b.format}` : "code";
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        const text = `${label}`;
        ctx.font = "16px ui-monospace, monospace";
        const tw = ctx.measureText(text).width;
        ctx.fillRect(x, y - 22, tw + 10, 20);
        ctx.fillStyle = "#fff";
        ctx.fillText(text, x + 5, y - 7);
      }

      // Corner points
      if (b.cornerPoints && b.cornerPoints.length) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#8ab4ff";
        ctx.moveTo(b.cornerPoints[0].x, b.cornerPoints[0].y);
        for (let i = 1; i < b.cornerPoints.length; i++) {
          ctx.lineTo(b.cornerPoints[i].x, b.cornerPoints[i].y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // 4. Scanning Loop
  private startScanning() {
    this.scanning = true;
    // Run outside Angular zone to prevent excessive change detection checks on every frame
    this.ngZone.runOutsideAngular(() => {
      this.scanLoop(performance.now());
    });
  }

  private async scanLoop(ts: number) {
    if (!this.scanning) return;

    const dt = ts - this.lastTime;
    const video = this.videoElement?.nativeElement;

    if (dt >= this.MIN_DT && video && video.readyState >= 2 && this.detector) {
      this.lastTime = ts;
      try {
        const barcodes = await this.detector.detect(video);
        
        // Draw directly (canvas updates don't need CD)
        this.drawDetections(barcodes);

        // Update Text Log (Requires Zone reentry for UI update)
        if (barcodes.length > 0) {
          this.ngZone.run(() => {
            this.logResult(barcodes);
          });
        }
      } catch (e) {
        // Ignore specific frame errors
      }
    }

    this.animationFrameId = requestAnimationFrame((t) => this.scanLoop(t));
  }

  private logResult(barcodes: any[]) {
    // Show the most confident first (heuristic based on rawValue length)
    // const best = [...barcodes].sort((a, b) => (b.rawValue?.length || 0) - (a.rawValue?.length || 0))[0];
    console.log("log barcode",barcodes)
    const lines = barcodes.map(b => `[${b.format || "unknown"}] ${b.rawValue ?? "(no value)"}`);
    this.logText = lines.join("\n");
    this.cdRef.detectChanges();

  }

  // 5. Utilities
  private handleVisibilityChange() {
    if (document.hidden) {
      this.scanning = false;
      if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    } else {
      this.startCamera().then(() => {
        this.startScanning();
      });
    }
  }
}