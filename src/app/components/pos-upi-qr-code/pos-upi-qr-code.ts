import { ChangeDetectorRef, Component, HostListener, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';
import { iDevice, iDeviceAdd } from '../../interface/iconnector';
import { defaultConfig } from '../../config/config';
import { FormsModule } from '@angular/forms';
import { QuerySnapshot, where } from 'firebase/firestore';

declare var showLoader: Function;



@Component({
  selector: 'app-pos-upi-qr-code',
  imports: [FormsModule],
  templateUrl: './pos-upi-qr-code.html',
  styleUrl: './pos-upi-qr-code.css'
})
export class PosUPIQrCode {
  user: any = null;
  user_initial: string | undefined = "";
  private subscribe_user: Subscription | undefined;

  // current device 
  private fb_subscribe_devices: any;
  currentDevice = signal<iDeviceAdd | null>(null);
  machineId: string | null = null;
  connectionCode: string = "737875";

  constructor(private cdRef: ChangeDetectorRef, private authService: AuthService, private firebaseService: FirebaseService) {
    // get auth user
    this.subscribe_user = this.authService.user$.subscribe(authState => {
      if (authState !== null) {
        this.user = authState;

        this.user_initial = authState.displayName?.split(" ").map(word => word.charAt(0)).join('');
      }
      else {
        this.user = null;
      }
    });
  }

  // Get collection data as Array
  getDataFromCollection(snapshot: any): any[] {
    let p: any = []
    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      p.push(d);
    });
    return p;
  }


  async ConnectedToDevice() {
    showLoader(true);
    if (this.machineId != null) {

      // get current Device and update the connection 
      let d = await this.firebaseService.getDocument(defaultConfig.collections.devices.name, this.machineId);
      console.log("device data", d);

      if (d != null) {
        // if session for this device exists then update the scan and UPI QUR code values to null 
        let device: iDeviceAdd = d;
        device.UPIScreen.UPIQrCode = null;
        device.UPIScreen.status = "CONNECTED";
        await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + this.machineId, device);

        //subscribe to device document
        this.fb_subscribe_devices = this.firebaseService.subscribeToDocument(defaultConfig.collections.devices.name, this.machineId, (snapshot) => {
          if (snapshot.exists()) {
            this.currentDevice.set(snapshot.data() as iDeviceAdd);
            console.log("current device", this.currentDevice());
          }
        });
        this.cdRef.detectChanges();

      }
      else {
        this.currentDevice.set(null);
        this.machineId = null;
        alert("Device docent exists. Please try to connect again")
        this.cdRef.detectChanges();
      }

      showLoader(false);
    }
  }

  async findDeviceByCde() {
    if (this.connectionCode != null && this.connectionCode.trim() != "") {
      // find the machine id using code
      let snapshot = await this.firebaseService.getCollection(defaultConfig.collections.devices.name, [where('scanner.connectionCode', '==', this.connectionCode)]);
      let d = this.getDataFromCollection(snapshot);
      if (d.length > 0) {
        this.machineId = d[0].docId;
        localStorage.setItem('connectedMachineId', d[0].docId)
        this.ConnectedToDevice();

      }
      else
        alert("Code not found.");
      console.log(d)
    }
  }

  ngOnInit() {
    showLoader(true);
    // get connected Machine id
    let machineId = localStorage.getItem('connectedMachineId');
    // if previously connected device exists then connect to the machine
    if (machineId != null) {
      this.machineId = machineId;
      this.ConnectedToDevice();
    }

    showLoader(false);
  }

   async disconnect() {
  
      if (this.currentDevice() != null) {
        // if session for this device exists then update the scan and UPI QUR code values to null 
        showLoader(true);
        const device = this.currentDevice();
        if (device) {
          device.UPIScreen.UPIQrCode = null;
          device.scanner.status = "WAITING";
          await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + this.machineId, device);
          localStorage.removeItem('connectedMachineId');
          this.machineId = null;
          this.currentDevice.set(null);
          this.connectionCode = "";
        }
        showLoader(false);
      }
    }


  ngOnDestroy() {
    alert("Closing");
    if (this.subscribe_user) {
      this.subscribe_user.unsubscribe()
    }
  }

  // Listens for the window:beforeunload event
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (this.currentDevice() != null) {
      // if session for this device exists then update the scan and UPI QUR code values to null 
      const device = this.currentDevice();
      if (device) {
        device.scanner.current_scan = null;
        device.scanner.status = "WAITING";
        this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + this.machineId, device);
      }
    }
  }
}
